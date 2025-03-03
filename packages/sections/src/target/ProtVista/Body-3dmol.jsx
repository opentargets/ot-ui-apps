import { SectionItem, usePlatformApi, OtTable } from "ui";
import { naLabel } from "@ot/constants";
import { Box, Checkbox, Grid, Button } from "@mui/material";
import Description from "./Description";
import { definition } from ".";
import { getUniprotIds } from "@ot/utils";
import ProtVista from "./ProtVista";
import { createViewer } from "3dmol";

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

const colorOnConfidence = function (atom) {
  if (atom.b > 90) return "royalblue";
  if (atom.b > 70) return "skyblue";
  if (atom.b > 50) return "yellow";
  return "orange";
};

function Body({ label: symbol, entity }) {
  const [experimentalResults, setExperimentalResults] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [viewers, setViewers] = useState(new Set());

  const request = usePlatformApi(PROTVISTA_SUMMARY_FRAGMENT);
  const uniprotId = request?.data ? getUniprotIds(request?.data?.proteinIds)?.[0] : null;

  console.log("renderingBody");

  function handleIdClick(id) {
    setSelectedIds(ids => {
      const newIds = new Set(ids);
      newIds[ids.has(id) ? "delete" : "add"](id);
      return newIds;
    });
  }

  const columns = [
    {
      id: "select",
      label: "Structure",
      renderCell: ({ id }) => {
        return (
          <Box
            sx={{ color: "steelblue", "&:hover": { cursor: "pointer" } }}
            onClick={() => handleIdClick(id)}
          >
            toggle
          </Box>
        );
      },
      // renderCell: ({ id }) => <Checkbox onChange={handleIdClick(id)} size="small" />,
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
        setSelectedIds(new Set([results.at(-1).id]));
        // setSelectedIds(new Set([results[0].id]));
      }
    }
    fetchAllResults();
    // RETURN CLEANUP FUNCTION IF APPROP
  }, [uniprotId, setExperimentalResults, selectedIds]);

  if (!request.data) return null; // BETTER WAY? - HANDLED BY CC'S CHANGE TO SECTION ITEM IF LOADING?

  return (
    <SectionItem
      definition={definition}
      entity={entity}
      request={{ ...request, data: { [entity]: request.data } }}
      renderDescription={() => <Description symbol={symbol} />}
      renderBody={() => {
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              {/* <Box position="relative" display="flex" justifyContent="center" pb={2} gap={2}>
                {[...selectedIds].map(id => (
                  <Viewer key={id} id={id} viewers={viewers} setViewers={setViewers} />
                ))}
              </Box> */}
            </Grid>
            <Grid item xs={12} md={12}>
              <OtTable
                showGlobalFilter={false}
                columns={columns}
                loading={!experimentalResults}
                rows={experimentalResults}
              />
            </Grid>
          </Grid>
        );
      }}
    />
  );
}

export default Body;

function Viewer({ id, viewers, setViewers }) {
  const [viewer, setViewer] = useState(null);
  const viewerRef = useRef(null);

  // fetch selected structure
  useEffect(() => {
    let viewer;
    async function fetchStructure() {
      if (viewerRef?.current) {
        const pdbUri = id.startsWith("AF")
          ? `${alphaFoldStructureStem}${id}${alphaFoldStructureSuffix}`
          : `${experimentalStructureStem}${id.toLowerCase()}${experimentalStructureSuffix}`;
        const data = await (await fetch(pdbUri)).text(); // ADD SOME ERROR HANDLING!!

        const config = { backgroundColor: "#f8f8f8", antialias: true };
        viewer = createViewer(viewerRef.current, config);
        viewer.addModel(data, "cif");
        const model = viewer.getModel();
        // window.model = model;
        viewer.setStyle(
          {},
          {
            cartoon: id.startsWith("AF") ? { colorfunc: colorOnConfidence } : { color: "spectrum" },
          }
        );
        viewer.zoomTo(); /* set camera */
        viewer.render(); /* render scene */
        // v.zoom(1.2, 1000); /* slight zoom */
        setViewer(viewer);
        setViewers(currentViewers => new Set([...currentViewers, viewer]));
      }
    }
    fetchStructure();
    return () => {
      // if (activeId === id) setActiveId(null);
      setViewers(currentViewers => {
        const newViewers = new Set(currentViewers);
        newViewers.delete(viewer);
        return newViewers;
      });
    };
  }, [viewer, id, setViewers]);

  return (
    <Box ref={viewerRef} position="relative" width="400px" height="400px">
      <Box position="absolute" m={1} p={0.5} zIndex={100} bgcolor="#f8f8f8">
        {id}
      </Box>
    </Box>
  );
}

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

- if show multiple structures, should enforce order same as rows

- alphaFold: instead of chains: (all) should list the chains?

- should use checkbox, but currently passing state to renderCell does not work?

- why does using checkbox instead of box cause issues?

- should have 'x' on each viewer for removal

- alphafold only showing first chain?!

- could allow user to specify residure range so can compare (or more easilt see) alignment for specific part of protein 

- can poss increase efficiency by using 3Dmol's createViewerGrid since uses a single canvas - but
  need to specify grid #rows and #cols on creation

*/
