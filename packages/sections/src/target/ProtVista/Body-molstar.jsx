import { SectionItem, usePlatformApi, OtTable } from "ui";
import { naLabel } from "@ot/constants";
import { Box, Grid } from "@mui/material";
import Description from "./Description";
import { definition } from ".";
import { getUniprotIds } from "@ot/utils";
import ProtVista from "./ProtVista";

import PROTVISTA_SUMMARY_FRAGMENT from "./summaryQuery.gql";
import { useState, useEffect, useRef } from "react";

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

function Body({ label: symbol, entity }) {
  const [experimentalResults, setExperimentalResults] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [viewer, setViewer] = useState(null);

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
        return resolution ? resolution.replace("A", "Å") : naLabel;
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
    // TO ADD:
    //  - PDBe LINK
    //    - if only 1 link per row, could make the ID the link
    //    - use identifiers.org
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
              chains: `(all)=${response[0].uniprotStart}-${response[0].uniprotEnd}`,
              method: "Prediction",
              resolution: "(prediction)",
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
      setViewer(
        new molstar.Viewer(viewerRef.current, {
          layoutShowControls: true,
          layoutIsExpanded: true,
          layoutShowSequence: true,
          layoutShowLog: false,
          layoutShowLeftPanel: true,
        })
      );
    }
    // RETURN CLEANUP FUNCTION IS ARRPROP
  }, [experimentalResults]);

  // fetch and load selected structure
  useEffect(() => {
    function fetchStructure() {
      molstar.Viewer.create(viewerRef.current, {
        layoutIsExpanded: false,
        layoutShowControls: false,
        layoutShowRemoteState: false,
        layoutShowSequence: true,
        layoutShowLog: false,
        layoutShowLeftPanel: true,
        viewportShowExpand: true,
        viewportShowSelectionMode: false,
        viewportShowAnimation: false,
      }).then(viewer => {
        selectedId.startsWith("AF")
          ? viewer.loadStructureFromUrl(
              `${alphaFoldStructureStem}${selectedId}${alphaFoldStructureSuffix}`
            )
          : viewer.loadPdb(selectedId);
      });
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
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={6}>
              <Box position="relative" display="flex" justifyContent="center" pb={2}>
                <Box ref={viewerRef} position="relative" width="100%" height="400px">
                  <Box
                    position="absolute"
                    m={1}
                    p={0.5}
                    zIndex={100}
                    borderRadius={2}
                    bgcolor="#f8f8f8"
                  >
                    {selectedId}
                  </Box>
                </Box>
              </Box>
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

- currently will stick with the uniprot_swissprot test for whether to include widget
  - this will always have an alphaFold prediction - and poss no experimental

- should include some visual controls - e.g. cartoon, ball-stick

- how indicate currently selected row - usint selectedId === id in a recderCell callback does not work

- if use paginated table. what if selected row not shown - what does the viewer show?

- GRIN1 is a target where have multiple positions on same row

- how come alphafold only has one start and end even when multiple chains? - or is this index
  global? (i.e. covers all chains?) 

- how should we color experimental structures?

*/
