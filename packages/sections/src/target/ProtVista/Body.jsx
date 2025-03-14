import { SectionItem, usePlatformApi, OtTable } from "ui";
import { naLabel } from "@ot/constants";
import { Box, colors, Grid, Typography } from "@mui/material";
import Description from "./Description";
import { definition } from ".";
import { getUniprotIds } from "@ot/utils";
import { createViewer } from "3dmol";
import { parseCif } from "./parseCif";
import { schemeSet2, schemePaired, color as d3Color } from "d3";

import PROTVISTA_SUMMARY_FRAGMENT from "./summaryQuery.gql";
import { useState, useEffect, useRef } from "react";
import { property } from "lodash";

const experimentalResultsStem = "https://www.ebi.ac.uk/proteins/api/proteins/";
const experimentalStructureStem = "https://www.ebi.ac.uk/pdbe/entry-files/download/";
const experimentalStructureSuffix = ".cif";
const alphaFoldResultsStem = "https://alphafold.ebi.ac.uk/api/prediction/";
const alphaFoldStructureStem = "https://alphafold.ebi.ac.uk/files/";
const alphaFoldStructureSuffix = "-model_v4.cif";

function getSegments(id, chainsAndPositions) {
  const printChains = [];
  const printSegments = [];
  const details = [];
  const substrings = chainsAndPositions.split(/,\s*/);
  for (const substr of substrings) {
    const eqIndex = substr.indexOf("=");
    const chains = substr.slice(0, eqIndex);
    printChains.push(chains);
    const sepChains = chains.split("/");
    const interval = substr.slice(eqIndex + 1);
    printSegments.push(substrings.length === 1 ? interval : `${chains}=${interval}`);
    const [from, to] = interval.split("-");
    for (const chain of sepChains) {
      details.push({ chain, from, to, length: to - from });
    }
  }
  return {
    rawString: chainsAndPositions, // !! REMOVE !!
    chainsString: printChains.join(", "),
    segmentsString: printSegments.join(", "),
    details,
  };
}

const alphaFoldConfidenceBands = [
  { lowerLimit: 90, label: "Very high", sublabel: "pLDDT > 90", color: "rgb(0, 83, 214)" },
  {
    lowerLimit: 70,
    label: "Confident",
    sublabel: "90 > pLDDT > 70",
    color: "rgb(101, 203, 243)",
  },
  { lowerLimit: 50, label: "Low", sublabel: "70 > pLDDT > 50", color: "rgb(255, 219, 19)" },
  { lowerLimit: 0, label: "Very low ", sublabel: "pLDDT < 50", color: "rgb(255, 125, 69)" },
];

// ssJmol color scheme - use explicitly here so easy to brighten
const secondaryStructureColors = {
  h: { basic: "#ff0080", bright: "#ff00d3" }, // helix
  s: { basic: "#ffc800", bright: "#ffff00" }, // sheet
  c: { basic: "#cccccc", bright: "#ffffff" }, // coil
  "arrow start": { basic: "#ffc800", bright: "#ffff00" },
  "arrow end": { basic: "#ffc800", bright: "#ffff00" },
};

function getConfidence(atom, propertyName = "label") {
  for (const obj of alphaFoldConfidenceBands) {
    if (atom.b > obj.lowerLimit) return obj[propertyName];
  }
  return alphaFoldConfidenceBands[0][propertyName];
}

const chainColorScheme = [...schemeSet2, ...schemePaired.filter((v, i) => i % 2)];
const chainDefaultColor = "#9999aa";
const chainColorLookup = {};
for (const [index, letter] of "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").entries()) {
  chainColorLookup[letter] = chainColorScheme[index % chainColorScheme.length];
}

function zipToObject(arr1, arr2) {
  const obj = {};
  if (!Array.isArray(arr1)) arr1 = [arr1];
  if (!Array.isArray(arr2)) arr2 = [arr2];
  arr1.forEach((value, index) => (obj[value] = arr2[index]));
  return obj;
}

function isAlphaFold(id) {
  return id?.startsWith("AF");
}

function AlphaFoldLegend() {
  return (
    <Box display="flex">
      <Box display="flex" flexDirection="column" ml={2} gap={0.75}>
        <Typography variant="subtitle2">Model Confidence</Typography>
        <Box display="flex" gap={3.5}>
          {alphaFoldConfidenceBands.map(({ label, sublabel, color }) => (
            <Box key={label}>
              <Box display="flex" gap={0.75} alignItems="center">
                <Box width="12px" height="12px" bgcolor={color} />
                <Box display="flex" flexDirection="column">
                  <Typography variant="caption" fontWeight={500} lineHeight={1}>
                    {label}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" fontSize={11.5} lineHeight={1}>
                {sublabel}
              </Typography>
            </Box>
          ))}
        </Box>

        <Typography variant="caption" mt={1}>
          AlphaFold produces a per-residue model confidence score (pLDDT) between 0 and 100. Some
          regions below 50 pLDDT may be unstructured in isolation.
        </Typography>
      </Box>
    </Box>
  );
}

function StructureIdPanel({ selectedStructure }) {
  return (
    <Box
      position="absolute"
      p="0.6rem 0.8rem"
      zIndex={100}
      bgcolor="#f8f8f8c8"
      sx={{ borderBottomRightRadius: "0.2rem" }}
      fontSize={14}
    >
      {selectedStructure?.id}
    </Box>
  );
}

function AtomInfoPanel({ atom, selectedStructure, entity }) {
  return (
    <Box
      position="absolute"
      bottom={0}
      right={0}
      p="0.6rem 0.8rem"
      zIndex={100}
      bgcolor="#f8f8f8c8"
      sx={{ borderBottomRightRadius: "0.2rem" }}
      fontSize={14}
    >
      <Box display="flex" flexDirection="column">
        <Typography variant="caption" textAlign="right">
          {entity}
        </Typography>
        <Typography variant="caption" textAlign="right">
          {atom.chain} | {atom.resn} {atom.resi}
        </Typography>
        {isAlphaFold(selectedStructure.id) && (
          <Typography variant="caption" textAlign="right">
            Confidence: {atom.b} ({getConfidence(atom)})
          </Typography>
        )}
      </Box>
    </Box>
  );
}

function Body({ label: symbol, entity }) {
  const [experimentalResults, setExperimentalResults] = useState(null);
  const [segments, setSegments] = useState(null);
  const [selectedStructure, setSelectedStructure] = useState(null);
  const [viewer, setViewer] = useState(null);
  const [selectedAtom, setSelectedAtom] = useState(null);
  const [chainToEntityDesc, setChainToEntityDesc] = useState(null);

  const viewerRef = useRef(null);

  const request = usePlatformApi(PROTVISTA_SUMMARY_FRAGMENT);
  const uniprotId = request?.data ? getUniprotIds(request?.data?.proteinIds)?.[0] : null;

  const columns = [
    {
      id: "select",
      label: "Structure",
      renderCell: row => {
        return (
          <Box
            sx={{ color: "steelblue", "&:hover": { cursor: "pointer" } }}
            onClick={() => setSelectedStructure(row)}
          >
            view
          </Box>
        );
      },
      exportValue: false,
    },
    {
      id: "type",
      label: "Source",
    },
    {
      id: "id",
      label: "ID",
    },
    {
      id: "properties.method",
      label: "Method",
    },
    {
      // NUMERIC/RIGHT ALIGN?
      id: "properties.resolution",
      label: "Resolution",
      renderCell: ({ properties: { resolution } }) => {
        return resolution != null ? resolution.replace("A", "Å") : naLabel;
      },
    },
    {
      id: "properties.chains",
      label: "Chain",
      renderCell: ({ id }) => (isAlphaFold(id) ? "" : segments[id].chainsString),
    },
    {
      id: "positions",
      label: "Positions",
      renderCell: ({ id }) => segments[id].segmentsString,
      exportValue: false,
    },
  ];

  function getAtomColor(atom) {
    return isAlphaFold(selectedStructure.id)
      ? getConfidence(atom, "color")
      : chainColorLookup[atom.chain] ?? chainDefaultColor;
  }

  // fetch experimental results
  useEffect(() => {
    const results = [];
    async function fetchAlphaFoldResults() {
      if (uniprotId) {
        const response = await fetch(`${alphaFoldResultsStem}${uniprotId}`).then(response =>
          response.json()
        );
        if (response.error) throw response.error;
        if (response?.length > 0) {
          results.unshift({
            id: response[0].entryId,
            type: "AlphaFold",
            properties: {
              chains: `=${response[0].uniprotStart}-${response[0].uniprotEnd}`,
              method: "Prediction",
              resolution: "",
            },
          });
        }
      }
    }
    async function fetchExperimentalResults() {
      if (uniprotId) {
        const response = await fetch(`${experimentalResultsStem}${uniprotId}`).then(response =>
          response.json()
        );
        if (response.error) throw response.error;
        const pdbResults = response?.dbReferences?.filter(row => row.type === "PDB") ?? [];
        results.push(...pdbResults);
      }
    }
    async function fetchAllResults() {
      await Promise.all([fetchAlphaFoldResults(), fetchExperimentalResults()]);
      if (results.length) {
        setExperimentalResults(results);
        const _segments = {};
        for (const row of results) {
          _segments[row.id] = getSegments(row.id, row.properties.chains);
        }
        setSegments(_segments);
        setSelectedStructure(results[0]);
      }
    }
    fetchAllResults();
    // RETURN CLEANUP FUNCTION IF APPROP
  }, [uniprotId, setExperimentalResults, setSegments]);

  // create viewer
  useEffect(() => {
    if (viewerRef.current && experimentalResults) {
      setViewer(
        createViewer(viewerRef.current, {
          backgroundColor: "#f8f8f8",
          antialias: true,
          cartoonQuality: 10,
        })
      );
    }
  }, [experimentalResults]);

  // fetch selected structure and view it
  useEffect(() => {
    async function fetchStructure() {
      if (selectedStructure && viewer) {
        const isAF = isAlphaFold(selectedStructure.id);
        const pdbUri = isAF
          ? `${alphaFoldStructureStem}${selectedStructure.id}${alphaFoldStructureSuffix}`
          : `${experimentalStructureStem}${selectedStructure.id.toLowerCase()}${experimentalStructureSuffix}`;
        let data = await (await fetch(pdbUri)).text(); // !! ADD SOME ERROR HANDLING !!

        const parsedCif = parseCif(data)[selectedStructure.id];

        // structure chains
        const structureChains = parsedCif["_pdbx_struct_assembly_gen.asym_id_list"];
        let firstStructureChains;
        let otherStructureChains;
        if (!isAF) {
          if (Array.isArray(structureChains)) {
            firstStructureChains = structureChains[0].split(",");
            otherStructureChains = structureChains.slice(1).join(",").split(",");
            const firstStructureChainsSet = new Set(firstStructureChains);
            otherStructureChains = otherStructureChains.filter(
              chain => !firstStructureChainsSet.has(chain)
            );
          } else {
            firstStructureChains = structureChains.split(",");
            otherStructureChains = [];
          }
        }

        // entities
        const entityIdToDesc = zipToObject(
          parsedCif["_entity.id"],
          parsedCif["_entity.pdbx_description"]
        );
        const chainToEntityId = zipToObject(
          parsedCif["_struct_asym.id"],
          parsedCif["_struct_asym.entity_id"]
        );
        const _chainToEntityDesc = {};
        for (const chain of parsedCif["_struct_asym.id"]) {
          _chainToEntityDesc[chain] = entityIdToDesc[chainToEntityId[chain]];
        }
        setChainToEntityDesc(_chainToEntityDesc);

        // invalidate auth fields for residue and chain forcing 3dmol to use the label (ie PDB) fields
        data = data.replace(/auth_(?:asym|seq)_id/g, match => `${match}X`);

        setSelectedAtom(null);
        viewer.clear();
        viewer.addModel(data, "cif"); /* load data */
        viewer.setClickable({}, true, atom => console.log(atom));
        viewer.setHoverDuration(100);
        viewer.setHoverable(
          {},
          true,
          function (atom) {
            setSelectedAtom(atom);
            if (atom && atom.resi) {
              const { resi, resn, chain } = atom;
              viewer.setStyle(
                { resi: resi, chain: chain },
                { cartoon: { color: "#555555", arrows: true } }
              );
              viewer.render();
            }
          },
          function (atom) {
            setSelectedAtom(null);
            const { resi, resn, chain } = atom;
            viewer.setStyle(
              { resi: resi, chain: chain },
              { cartoon: { colorfunc: getAtomColor, arrows: true } }
            );
            viewer.render();
          }
        );

        if (isAF) {
          viewer.setStyle({}, { cartoon: { colorfunc: getAtomColor, arrows: true } });
        } else {
          viewer.setStyle(
            { chain: firstStructureChains },
            { cartoon: { colorfunc: getAtomColor, arrows: true } }
          );
          viewer.getModel().setStyle({ chain: otherStructureChains }, { hidden: true });
        }

        viewer.zoomTo(isAF ? undefined : { chain: firstStructureChains }); /* set camera */
        viewer.render(); /* render scene */
        // viewer.zoom(1.5, 1000); /* slight zoom */

        window.viewer = viewer; // !! REMOVE !!
      }
    }
    fetchStructure();
    // RETURN CLEANUP FUNCTION IF APPROP
  }, [selectedStructure, viewer, setChainToEntityDesc]);

  if (!request.data) return null; // BETTER WAY? - HANDLED BY CC'S CHANGE TO SECTION ITEM IF LOADING?

  return (
    <SectionItem
      definition={definition}
      entity={entity}
      request={{ ...request, data: { [entity]: request.data } }}
      renderDescription={() => <Description symbol={symbol} />}
      // showContentLoading={true}
      renderBody={() => {
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} lg={6}>
              <OtTable
                // dataDownloader
                showGlobalFilter={false}
                // dataDownloaderFileStem={`${studyLocusId}-credibleSets`}
                // sortBy="pValue"
                // order="asc"
                columns={columns}
                loading={!experimentalResults}
                rows={experimentalResults}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <Box position="relative" display="flex" justifyContent="center" pb={2}>
                <Box ref={viewerRef} position="relative" width="100%" height="400px">
                  <StructureIdPanel selectedStructure={selectedStructure} />
                  {selectedAtom && (
                    <AtomInfoPanel
                      atom={selectedAtom}
                      selectedStructure={selectedStructure}
                      entity={chainToEntityDesc[selectedAtom.chain]}
                    />
                  )}
                </Box>
              </Box>
              {isAlphaFold(selectedStructure?.id) && <AlphaFoldLegend />}
            </Grid>
          </Grid>
        );
      }}
    />
  );
}

export default Body;

/*

NOTES:

- vheight of widget jumps depending on whether show legend or not - but wait to see if use legend on non-AF
  which will help

- zoom slightly by default but dosable animation

- should include some visual controls - e.g. cartoon, ball-stick, different color-by optoins, ...?

- use click on row and show active row once added to table component

- if use paginated table, what if selected row not shown - what does the viewer show?

- look over other API options such as quality

- use theme colors (or grey[600] etc)

- add PDBe link only?
    - if only 1 link per row, could make the ID the link
    - use identifiers.org

- any way to avoid full rendering on hover (which includes calling colorfunc for every atom)
  - there are addStyle and updateStyle methods that may help

- improve highlighting so just a light/darker of current color - d3 lghter/darker not giving nice results

- add error handling for fetch and anywhere else approp

- highlight chains of experiment - or faint the other shown chanins

- legend for chains?

- allow coloring by entity?

- KRAS NMR results such as 2MSC are giving error but i think due to invalid CIF file - 
    - the _pdbx_struct_assembly_gen.asym_id_list  field has final t missing

- order table by experiment type, chain, ...

*/
