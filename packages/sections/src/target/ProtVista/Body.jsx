import { SectionItem, usePlatformApi, OtTable } from "ui";
import { naLabel } from "@ot/constants";
import { Box, colors, Grid, Typography } from "@mui/material";
import Description from "./Description";
import { definition } from ".";
import { getUniprotIds, nanComparator } from "@ot/utils";
import { createViewer, isNumeric } from "3dmol";
import { parseCif } from "./parseCif";
import {
  schemeSet1,
  schemePaired,
  color as d3Color,
  max,
  schemeSet2,
  schemeTableau10,
  schemeCategory10,
} from "d3";

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
  const details = {};
  const substrings = chainsAndPositions.split(/,\s*/);
  let maxLengthSegment = -Infinity;
  for (const substr of substrings) {
    const eqIndex = substr.indexOf("=");
    const chains = substr.slice(0, eqIndex);
    printChains.push(chains);
    const sepChains = chains.split("/");
    const interval = substr.slice(eqIndex + 1);
    printSegments.push(substrings.length === 1 ? interval : `${chains}=${interval}`);
    const [from, to] = interval.split("-");
    maxLengthSegment = Math.max(maxLengthSegment, to - from);
    for (const chain of sepChains) {
      details[chain] ??= [];
      details[chain].push({ from, to });
    }
  }
  return {
    rawString: chainsAndPositions, // !! REMOVE !!
    chainsString: printChains.join(", "),
    segmentsString: printSegments.join(", "),
    details,
    uniqueChains: new Set(Object.keys(details)),
    maxLengthSegment,
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

function getConfidence(atom, propertyName = "label") {
  for (const obj of alphaFoldConfidenceBands) {
    if (atom.b > obj.lowerLimit) return obj[propertyName];
  }
  return alphaFoldConfidenceBands[0][propertyName];
}

const chainColorScheme = [
  ...[1, 2, 3, 4, 0, 6, 7].map(i => schemeSet1[i]),
  ...schemeSet2.slice(0, -1),
  ...schemeTableau10.slice(0, -1),
  ...schemePaired.filter((v, i) => i % 2 === 1),
  ...schemeCategory10.slice(0, -1),
];
const chainDefaultColor = "#9999aa";
const chainColorIndex = {};
for (const [index, letter] of "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  .split("")
  .entries()) {
  chainColorIndex[letter] = index % chainColorScheme.length;
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

function hoverManagerFactory({ viewer, atomInfoRef, chainToEntityDesc, isAF }) {
  return [
    {},
    true,
    // 3Dmol's builtin labels
    // atom => {
    //   if (!atom.label) {
    //     atom.label = viewer.addLabel(atom.resn + ":" + atom.atom, {
    //       position: atom,
    //       backgroundColor: "mintcream",
    //       fontColor: "black",
    //     });
    //   }
    // },
    // atom => {
    //   if (atom.label) {
    //     viewer.removeLabel(atom.label);
    //     delete atom.label;
    //   }
    // },

    atom => {
      const infoElmt = atomInfoRef.current;
      if (infoElmt) {
        infoElmt.style.display = "block";
        const fieldElmts = [...infoElmt.querySelectorAll("p")];
        fieldElmts[0].textContent = chainToEntityDesc[atom.chain];
        fieldElmts[1].textContent = `${atom.chain} | ${atom.resn} ${atom.resi}`;
        fieldElmts[2].textContent = isAF ? `Confidence: ${atom.b} (${getConfidence(atom)})` : "";
      }
    },
    () => {
      if (atomInfoRef.current) {
        atomInfoRef.current.style.display = "none";
      }
    },
  ];
}

function Body({ label: symbol, entity }) {
  const [experimentalResults, setExperimentalResults] = useState(null);
  const [segments, setSegments] = useState(null);
  const [selectedStructure, setSelectedStructure] = useState(null);
  const [viewer, setViewer] = useState(null);
  const [chainToEntityDesc, setChainToEntityDesc] = useState(null);

  const viewerRef = useRef(null);
  const atomInfoRef = useRef(null);

  const request = usePlatformApi(PROTVISTA_SUMMARY_FRAGMENT);
  const uniprotId = request?.data ? getUniprotIds(request?.data?.proteinIds)?.[0] : null;

  const columns = [
    {
      id: "select",
      label: "Structure",
      filterValue: false,
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
      sortable: true,
    },
    {
      id: "id",
      label: "ID",
      sortable: true,
    },
    {
      id: "properties.method",
      label: "Method",
      sortable: true,
    },
    {
      // NUMERIC/RIGHT ALIGN?
      id: "properties.resolution",
      label: "Resolution",
      sortable: true,
      numeric: true,
      filterValue: false,
      comparator: nanComparator(
        (a, b) => a - b,
        row => +row?.properties?.resolution?.replace(/\s*A/, ""),
        false
      ),
      renderCell: ({ properties: { resolution } }) => {
        return resolution != null ? resolution.replace("A", "Å") : naLabel;
      },
      exportValue: ({ properties: { resolution } }) => {
        return resolution?.replace("A", "Å");
      },
    },
    {
      id: "properties.chains",
      label: "Chain",
      filterValue: false,
      renderCell: ({ id }) => segments[id].chainsString,
      exportValue: ({ id }) => segments[id].chainsString,
    },
    {
      id: "positions",
      label: "Positions",
      sortable: true,
      comparator: (a, b) => {
        return segments?.[a?.id]?.maxLengthSegment - segments?.[b?.id]?.maxLengthSegment;
      },
      renderCell: ({ id }) => segments[id].segmentsString,
      exportValue: ({ id }) => segments[id].segmentsString,
    },
    // {
    //   id: "longestSegment",
    //   label: "Longest segment",
    //   renderCell: ({ id }) => segments[id].maxLengthSegment,
    // },
  ];

  function getAtomColor(atom) {
    return isAlphaFold(selectedStructure.id)
      ? getConfidence(atom, "color")
      : segments[selectedStructure.id].details[atom.chain]
      ? chainColorScheme[chainColorIndex[atom.chain]]
      : chainColorScheme[[chainColorIndex[atom.chain[0]]]] ?? "#888";
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
              chains: `A=${response[0].uniprotStart}-${response[0].uniprotEnd}`,
              method: "Prediction",
              resolution: undefined,
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
        let firstStructureTargetChains = [];
        let firstStructureNonTargetChains = [];
        let otherStructureChains;
        const targetChains = segments[selectedStructure.id].uniqueChains;
        if (structureChains) {
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
          for (const chain of firstStructureChains) {
            (targetChains.has(chain)
              ? firstStructureTargetChains
              : firstStructureNonTargetChains
            ).push(chain);
          }
        } else {
          // data missing/invalid _pdbx_struct_assembly_gen.asym_id_list (includes AlphaFold)
          const allChains = new Set(parsedCif["_atom_site.auth_asym_id"]);
          const targetChainsSet = new Set(targetChains);
          firstStructureChains = [...allChains];
          firstStructureTargetChains.push(...targetChains);
          firstStructureNonTargetChains = firstStructureChains.filter(
            chain => !targetChainsSet.has(chain)
          );
          otherStructureChains = [];
        }
        // console.log({
        //   targetChains,
        //   firstStructureChains,
        //   firstStructureTargetChains,
        //   firstStructureNonTargetChains,
        // });

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

        // invalidate auth fields for residue and chain forcing 3Dmol to use the label (ie PDB) fields
        data = data.replace(/auth_(?:asym|seq)_id/g, match => `${match}X`);

        viewer.clear();
        viewer.addModel(data, "cif"); /* load data */
        viewer.setClickable({}, true, atom => console.log(atom));
        viewer.setHoverDuration(0);
        viewer.setHoverable(
          ...hoverManagerFactory({
            viewer,
            atomInfoRef,
            chainToEntityDesc: _chainToEntityDesc,
            isAF,
          })
        );

        if (isAF) {
          viewer.setStyle({}, { cartoon: { colorfunc: getAtomColor, arrows: true } });
        } else {
          viewer.setStyle(
            { chain: firstStructureTargetChains },
            { cartoon: { colorfunc: getAtomColor, arrows: true } }
          );
          viewer.setStyle(
            { chain: firstStructureNonTargetChains },
            {
              cartoon: {
                color: "#eee",
                arrows: true,
                opacity: 0.8,
              },
            }
          );
          viewer.getModel().setStyle({ chain: otherStructureChains }, { hidden: true });
        }
        viewer.zoomTo({
          chain: firstStructureTargetChains.length
            ? firstStructureTargetChains
            : firstStructureChains,
        });
        viewer.zoom(isAF ? 1.4 : 1);
        viewer.render();

        window.viewer = viewer; // !! REMOVE !!
      }
    }
    fetchStructure();
    // RETURN CLEANUP FUNCTION IF APPROP
  }, [selectedStructure, viewer, setChainToEntityDesc, segments]);

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
                dataDownloader
                showGlobalFilter
                // dataDownloaderFileStem={`${studyLocusId}-credibleSets`}
                sortBy="positions"
                order="desc"
                columns={columns}
                loading={!experimentalResults}
                rows={experimentalResults}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <Box position="relative" display="flex" justifyContent="center" pb={2}>
                <Box ref={viewerRef} position="relative" width="100%" height="400px">
                  <StructureIdPanel selectedStructure={selectedStructure} />
                  <Box
                    ref={atomInfoRef}
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
                      <Typography variant="caption" component="p" textAlign="right" />
                      <Typography variant="caption" component="p" textAlign="right" />
                      <Typography variant="caption" component="p" textAlign="right" />
                    </Box>
                  </Box>
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
