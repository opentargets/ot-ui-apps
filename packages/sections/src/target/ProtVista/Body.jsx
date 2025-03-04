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

function Body({ label: symbol, entity }) {
  const [experimentalResults, setExperimentalResults] = useState(null);
  const [viewerControl, setViewerControl] = useState(null);
  const viewerControlRef = useRef(viewerControl); // synced with viewerControl state - needed for event listeners
  const viewerWrapperRef = useRef(null);

  const request = usePlatformApi(PROTVISTA_SUMMARY_FRAGMENT);
  const uniprotId = request?.data ? getUniprotIds(request?.data?.proteinIds)?.[0] : null;

  function handleIdClick(id) {
    viewerControlRef.current.toggleViewer(id);
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

  // keep viewerControl ref in sync with viewerControl state
  useEffect(() => {
    viewerControlRef.current = viewerControl; // Keep ref in sync with state
  }, [viewerControl]);

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
        // viewerControl.addViewer(results.at(-1).id);
      }
    }
    fetchAllResults();
    // RETURN CLEANUP FUNCTION IF APPROP
  }, [uniprotId, setExperimentalResults]);

  // create viewer control
  useEffect(() => {
    if (viewerWrapperRef.current && experimentalResults) {
      const vc = createViewerControl(viewerWrapperRef.current);
      vc.addViewer(experimentalResults.at(-1).id);
      setViewerControl(vc);
    }
    return () => {
      viewerControl?.destroy();
      setViewerControl(null);
    };
  }, [experimentalResults, setViewerControl]);

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
            <Grid item xs={12} md={12} ref={viewerWrapperRef} display="flex" gap={2}></Grid>
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

function createViewerControl(wrapperElement) {
  const viewers = new Map(); // key-value pairs are id-viewer
  let isUpdating = false; // flag to avoid recursive syncing of views

  async function addViewer(id) {
    const pdbUri = id.startsWith("AF")
      ? `${alphaFoldStructureStem}${id}${alphaFoldStructureSuffix}`
      : `${experimentalStructureStem}${id.toLowerCase()}${experimentalStructureSuffix}`;
    const data = await (await fetch(pdbUri)).text(); // ADD SOME ERROR HANDLING!
    const viewerElement = document.createElement("div");
    viewerElement.setAttribute("style", "position: relative; width: 400px; height: 400px");
    addIdLabel(viewerElement, id);
    // const tooltip = addTooltip(viewerElement);
    wrapperElement.append(viewerElement);
    const viewer = createViewer(viewerElement, { backgroundColor: "#f8f8f8", antialias: true });
    viewer.__element__ = viewerElement;
    viewer.addModel(data, "cif");
    // const model = viewer.getModel();
    // window.model = model;
    viewer.setStyle(
      {},
      {
        // stick: {},
        // sphere: {},
        cartoon: id.startsWith("AF") ? { colorfunc: colorOnConfidence } : { color: "spectrum" },
      }
    );
    viewer.setViewChangeCallback(quaternion => {
      if (isUpdating) return;
      isUpdating = true;
      viewers.values().forEach(v => {
        if (v !== viewer) v.setView(quaternion);
      });
      isUpdating = false;
    });

    viewer.setHoverable(
      {},
      true,
      atom => console.log("hover"),
      () => console.log("unhover")
    );
    viewer.setClickable(
      {},
      true,
      atom => console.log(atom)
      // () => console.log("unhover")
    );

    // function (atom, viewer, event, container) {
    //   console.log("HOVERING");
    //   let info = `Residue: ${atom.resn} ${atom.resi}\nChain: ${atom.chain}`;
    //   tooltip.textContent = info;
    //   tooltip.style.top = 30;
    //   tooltip.style.left = 30;
    //   // tooltip.style.top = event.pageY + 5;
    //   // tooltip.style.left = event.pageX + 5;
    //   tooltip.style.display = "block";
    // },
    // function (atom, viewer) {
    //   tooltip.style.display = "none";
    // }
    // );
    viewer.zoomTo(); /* set camera */
    viewer.render(); /* render scene */
    // v.zoom(1.2, 1000); /* slight zoom */
    viewers.set(id, viewer);
  }

  function removeViewer(id) {
    const viewer = viewers.get(id);
    if (viewer) {
      viewers.delete(id);
      viewer.clear();
      viewer.__element__.remove();
    }
  }

  function toggleViewer(id) {
    (viewers.has(id) ? removeViewer : addViewer)(id);
  }

  function destroy() {
    viewers.keys().forEach(removeViewer);
  }

  function addIdLabel(viewerElement, id) {
    const displayIdElement = document.createElement("div");
    displayIdElement.setAttribute(
      "style",
      "position: absolute; padding: 0.5rem; z-index: 100; background-color: #f8f8f8cc"
    );
    displayIdElement.textContent = id;
    viewerElement.append(displayIdElement);
  }

  function addTooltip(viewerElement) {
    const tooltipElement = document.createElement("div");
    tooltipElement.setAttribute(
      "style",
      "position: absolute; padding: 0.5rem; z-index: 200; background-color: red; pointer-events: none"
    );
    tooltipElement.textContent = "TOOLTIP";
    viewerElement.append(tooltipElement);
    return tooltipElement;
  }

  return { addViewer, removeViewer, toggleViewer, destroy };
}

function colorOnConfidence(atom) {
  if (atom.b > 90) return "royalblue";
  if (atom.b > 70) return "skyblue";
  if (atom.b > 50) return "yellow";
  return "orange";
}

/*

NOTES:



- should call destroy() on viewControl when component unmounts? - how?

- if use paginated table. what if selected row not shown - what does the viewer show?

- how come alphafold only has one start and end even when multiple chains? - or is this index
  global? (i.e. covers all chains?) 

- if show multiple structures, should enforce order same as rows

- alphaFold: instead of chains: (all) should list the chains?

- should use checkbox, but currently passing state to renderCell does not work?

- why does using checkbox instead of box cause issues?

- should have 'x' on each viewer for removal

- alphafold only showing first chain?!

- could allow user to specify residure range so can compare (or more easilt see) alignment for specific part of protein 

- can poss increase efficiency by using 3Dmol's createViewerGrid since uses a single canvas - but
  need to specify grid #rows and #cols on creation

- sep viewers nice since may have different parts of the protein, and even when havesame/overlapping regions
  the global alignment can suggest better/worse similarity of an AOI?

- if include multiple viewers:
  - use checkbox column to show currently viewed - set checked of boxes from viewerControl
  - include constrols for: whether viewers are independent or synced - may have to disabe synced
    option where insufficient common residues
      - also a reset all viewers transforms button?
  - if synced, need to align the original 3d shapes based on (at least some) shared residues - syncing should
    take care fo rest
      - could allow alignmne on area/chain/subchain/pocket/region of interest
  - think how best to color to indicate correpsondence - eg.
    - each chain has its own color - which could be sequential so can see correpsondence within chain
    - link hover so can see correspondence over residue

- hovering on atoms seems flaky. Callbacls mostly no firing when call setHoverable, but do seem to fire
  if use setClickable - both when click and after this the hover callback fires?!


*/
