import { SectionItem, usePlatformApi, OtTable } from "ui";
import { naLabel } from "@ot/constants";
import { Box, colors, Grid, Typography } from "@mui/material";
import Description from "./Description";
import { definition } from ".";
import { getUniprotIds } from "@ot/utils";
import ProtVista from "./ProtVista";
import { createViewer } from "3dmol";
import { color, schemeSet2 as secondaryStructureScheme } from "d3";

import PROTVISTA_SUMMARY_FRAGMENT from "./summaryQuery.gql";
import { useState, useEffect, useRef } from "react";
import { property } from "lodash";

const experimentalResultsStem = "https://www.ebi.ac.uk/proteins/api/proteins/";
const experimentalStructureStem = "https://www.ebi.ac.uk/pdbe/entry-files/download/";
const experimentalStructureSuffix = ".cif";
const alphaFoldResultsStem = "https://alphafold.ebi.ac.uk/api/prediction/";
const alphaFoldStructureStem = "https://alphafold.ebi.ac.uk/files/";
const alphaFoldStructureSuffix = "-model_v4.cif";

function getChainsAndPositions(str) {
  const chains = new Set();
  const positions = [];
  for (const substr of str.split(/,\s*/)) {
    const eqIndex = substr.indexOf("=");
    chains.add(substr.slice(0, eqIndex));
    positions.push(substr.slice(eqIndex + 1));
  }
  return { chains: Array.from(chains), positions };
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

// const secondaryStructureColors = {
//   h: secondaryStructureScheme[0], // helix
//   s: secondaryStructureScheme[1], // sheet
//   c: secondaryStructureScheme[2], // coil
// };

function getConfidence(atom, propertyName = "label") {
  for (const obj of alphaFoldConfidenceBands) {
    if (atom.b > obj.lowerLimit) return obj[propertyName];
  }
  return alphaFoldConfidenceBands[0][propertyName];
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

function StructureIdPanel({ selectedId }) {
  return (
    <Box
      position="absolute"
      p="0.6rem 0.8rem"
      zIndex={100}
      bgcolor="#f8f8f8c8"
      sx={{ borderBottomRightRadius: "0.2rem" }}
      fontSize={14}
    >
      {selectedId}
    </Box>
  );
}

function AtomInfoPanel({ atom, selectedId }) {
  console.log(atom);
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
        <Typography variant="caption">
          {atom.resn} {atom.resi}, chain {atom.chain}
        </Typography>
        {isAlphaFold(selectedId) && (
          <Typography variant="caption">
            Confidence: {atom.b} ({getConfidence(atom)})
          </Typography>
        )}
      </Box>
    </Box>
  );
}

function Body({ label: symbol, entity }) {
  const [experimentalResults, setExperimentalResults] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [viewer, setViewer] = useState(null);
  const [selectedAtom, setSelectedAtom] = useState(null);

  const viewerRef = useRef(null);

  const request = usePlatformApi(PROTVISTA_SUMMARY_FRAGMENT);
  const uniprotId = request?.data ? getUniprotIds(request?.data?.proteinIds)?.[0] : null;

  const columns = [
    {
      id: "select",
      label: "Structure",
      renderCell: ({ id }) => {
        return (
          <Box
            sx={{ color: "steelblue", "&:hover": { cursor: "pointer" } }}
            onClick={() => setSelectedId(id)}
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
      renderCell: ({ properties: { chains } }) => {
        return [...getChainsAndPositions(chains).chains].join(", ");
      },
    },
    {
      id: "positions",
      label: "Positions",
      renderCell: ({ properties: { chains: chainsAndPositions } }) => {
        const { chains, positions } = getChainsAndPositions(chainsAndPositions);
        return chains.length === 1 ? positions.join(", ") : chainsAndPositions;
      },
      exportValue: false,
    },
  ];

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
              // chains: `(all)=${response[0].uniprotStart}-${response[0].uniprotEnd}`,
              method: "Prediction",
              resolution: "",
              // resolution: "(prediction)",
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
        setSelectedId(results[0].id);
      }
    }
    fetchAllResults();
    // RETURN CLEANUP FUNCTION IF APPROP
  }, [uniprotId]);

  // create viewer
  useEffect(() => {
    if (viewerRef.current && experimentalResults) {
      setViewer(createViewer(viewerRef.current, { backgroundColor: "#f8f8f8", antialias: true }));
    }
  }, [experimentalResults]);

  // fetch selected structure
  useEffect(() => {
    async function fetchStructure(structureId) {
      if (selectedId && viewer) {
        const pdbUri = isAlphaFold(selectedId)
          ? `${alphaFoldStructureStem}${selectedId}${alphaFoldStructureSuffix}`
          : `${experimentalStructureStem}${selectedId.toLowerCase()}${experimentalStructureSuffix}`;
        const data = await (await fetch(pdbUri)).text(); // !! ADD OMSE ERROR HANDLING !!
        setSelectedAtom(null);
        viewer.clear();
        viewer.addModel(data, "cif"); /* load data */
        // viewer.setClickable({}, true, atom => console.log(atom));
        // viewer.setHoverable(
        //   {},
        //   true,
        //   function (atom) {
        //     setSelectedAtom(atom);
        //     if (atom && atom.resi) {
        //       let resi = atom.resi;
        //       let chain = atom.chain;
        //       let resn = atom.resn;
        //       viewer.setStyle(
        //         { resi: resi, chain: chain },
        //         { cartoon: { color: "red" } }
        //         // { cartoon: { color: "red" }, stick: { radius: 0.3 } }
        //       );
        //       viewer.render();
        //     }
        //   },
        //   function (atom) {
        //     setSelectedAtom(null);
        //     if (atom && atom.resi) {
        //       viewer.setStyle({}, { cartoon: { color: "spectrum" } }); // Reset colors
        //       viewer.render();
        //     }
        //   }
        // );

        viewer.setStyle(
          {},
          {
            cartoon: {
              ...(isAlphaFold(selectedId)
                ? { colorfunc: atom => getConfidence(atom, "color") }
                : { colorscheme: "ssJmol" }),
              // : { colorfunc: atom => secondaryStructureColors[atom.ss] }),
              // : { color: "spectrum" }),
              arrows: true,
              // style: "parabola",
            },
            // line: { color: "#000", lineWidth: 5 },
          }
        );
        viewer.zoomTo(); /* set camera */
        viewer.render(); /* render scene */
        viewer.zoom(1.5, 1000); /* slight zoom */
        // window.viewer = viewer; // !! REMOVE !!
      }
    }
    fetchStructure();
    // RETURN CLEANUP FUNCTION IF APPROP
  }, [selectedId, viewer]);

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
                  <StructureIdPanel selectedId={selectedId} />
                  {selectedAtom && <AtomInfoPanel atom={selectedAtom} selectedId={selectedId} />}
                </Box>
              </Box>
              {isAlphaFold(selectedId) && <AlphaFoldLegend />}
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

- currently will stick with the uniprot_swissprot test for whether to include widget
  - this will always have an alphaFold prediction - and poss no experimental

- should include some visual controls - e.g. cartoon, ball-stick, different color-by optoins, ...?

- use click on row and show active row once added to table component

- if use paginated table, what if selected row not shown - what does the viewer show?

- look over other API options such as quality

- use theme colors (or grey[600] etc)

- change widget description - and name?

- add PDBe link only?
    - if only 1 link per row, could make the ID the link
    - use identifiers.org

- no easy way to get enetiy name that a residu belongs to in 3d mol - look at parsing the
  .cif file or using a separate API call

*/
