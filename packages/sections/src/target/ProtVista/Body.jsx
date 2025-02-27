import { SectionItem, usePlatformApi, OtTable } from "ui";
import { Box, Button } from "@mui/material";
import { naLabel } from "../../constants";
import Description from "./Description";
import { definition } from ".";
import { getUniprotIds } from "../../utils/global";
import ProtVista from "./ProtVista";
// import * as mol3d from "3dmol";
import { createViewer } from "3dmol";

// debugger;

// import * as molstar from "";
// import NightingaleVis from "./NightingaleVis";

// debugger;

import PROTVISTA_SUMMARY_FRAGMENT from "./summaryQuery.gql";
import { useState, useEffect, useRef } from "react";

function Body({ label: symbol, entity }) {
  const [experimentalResults, setExperimentalResults] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const viewerRef = useRef(null);

  // console.log(experimentalResults);

  const request = usePlatformApi(PROTVISTA_SUMMARY_FRAGMENT);
  if (!request.data) return null; // BETTER WAY? - HANDLED BY CC'S CHANGE TO SECTION ITEM IF LOADING?
  const uniprotId = getUniprotIds(request.data?.proteinIds)?.[0];

  const columns = [
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
        return chains.slice(0, chains.indexOf("="));
      },
    },
    {
      id: "positions",
      label: "Positions",
      renderCell: ({ properties: { chains } }) => {
        return chains.slice(chains.indexOf("=") + 1);
      },
      exportValue: false,
    },
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
    // TO ADD:
    //  - PDBe LINK
    //    - if only 1 link per row, could make the ID the link
    //    - use identifiers.org
    //  - AND BUTTON TO SELECT ROW
  ];

  // fetch experimental results
  useEffect(() => {
    async function fetchExperimentalResults(uniProtId) {
      const response = await fetch(`https://www.ebi.ac.uk/proteins/api/proteins/${uniProtId}`).then(
        response => response.json()
      );
      if (response.error) throw response.error;
      const results = response?.dbReferences?.filter(row => row.type === "PDB") ?? [];
      setExperimentalResults(results);
      setSelectedId(results[0]?.id);
    }
    fetchExperimentalResults(uniprotId);
    // RETURN CLEANUP FUNCTION IF APPROP
  }, [uniprotId]);

  // fetch selected structure
  useEffect(() => {
    async function fetchStructure(structureId) {
      if (selectedId && viewerRef?.current) {
        // console.log("STRUCTURE VIEWER EFFECT");
        let config = { backgroundColor: "#f8f8f8", antialias: true };
        let viewer = createViewer(viewerRef.current, config);

        // viewer.setBackgroundColor("#f4f4f4");

        // let pdbUri = "/path/to/your/pdb/files/1ycr.pdb";

        // const pdbUri = "https://files.rcsb.org/download/1CRN.pdb";
        const pdbUri = `https://files.rcsb.org/download/${selectedId}.pdb`;
        // const pdbUri = "https://files.rcsb.org/download/1n26.pdb";
        // const pdbUri = "https://files.rcsb.org/download/1CRN.pdb";
        // const pdbUri = "https://www.ebi.ac.uk/pdbe/entry-files/download/4k33.bcif";
        // const pdbUri = "https://alphafold.ebi.ac.uk/files/AF-A0A2K5QXN6-F1-model_v4.pdb";
        // "https://alphafold.ebi.ac.uk/files/AF-Q9Y3C4-F1-model_v4.pdb";

        const data = await (await fetch(pdbUri)).text();

        // Define confidence color mapping (pLDDT stored in B-factor field)
        var colorScheme = {
          prop: "bfactor", // Use B-factor (pLDDT confidence score)
          // gradient: "rwb", // Red (low) → White (medium) → Blue (high)
          // min: 50, // pLDDT below 50 (low confidence)
          // max: 100, // pLDDT above 90 (high confidence)
        };

        const colorAsSnake = function (atom) {
          // debugger;
          // console.log(atom.b);
          if (atom.b > 90) return "blue";
          if (atom.b > 70) return "skyblue";
          if (atom.b > 50) return "yellow";
          return "orange";
          // return atom.b > 92 ? "lime" : "magenta";
          // return atom.resi % 2 == 0 ? "white" : "green";
        };

        const v = viewer;
        v.addModel(data, "pdb"); /* load data */
        // v.setStyle({}, { cartoon: { color: "spectrum" } }); /* style all atoms */
        // v.setStyle({}, { cartoon: { color: "spectrum" } }); /* style all atoms */
        // Apply coloring by confidence
        v.setStyle({ chain: "A" }, { cartoon: { colorfunc: colorAsSnake } });
        // v.setStyle({ cartoon: { color: colorScheme } });
        // v.setStyle({}, { cartoon: { color: "bfactor" } });
        v.zoomTo(); /* set camera */
        v.render(); /* render scene */
        v.zoom(1.2, 1000); /* slight zoom */
      }
    }
    fetchStructure();
    // }, []); // SHOULD BE BELOW BUT HOOKS ERROR!
  }, [selectedId]);

  return (
    <SectionItem
      definition={definition}
      entity={entity}
      request={{ ...request, data: { [entity]: request.data } }}
      renderDescription={() => <Description symbol={symbol} />}
      // showContentLoading={true}
      renderBody={() => {
        return (
          <>
            <Box position="relative" display="flex" justifyContent="center" pb={2}>
              <Box ref={viewerRef} position="relative" width="100%" height="400px">
                <Box position="absolute" p={1} zIndex={100}>
                  {selectedId}
                </Box>
              </Box>
            </Box>
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
          </>
        );
      }}

      // renderBody={() => {
      //   const uniprotId = getUniprotIds(request.data?.proteinIds)[0];
      //   return (
      //     <Box display="flex" flexDirection="column" gap={6}>
      //       {/* <NightingaleVis uniprotId={uniprotId} /> */}
      //       {/* <Box height="1px" bgcolor="#000" />  */}
      // <ProtVista uniprotId={uniprotId} />
      //     </Box>
      //   );
      // }}
    />
  );
}

export default Body;

// ========== helpers ==========

// function processExperimentalResults(results) {
//   results.
// }

/*

NOTES:

- list of structures:
  - experimental: https://www.ebi.ac.uk/proteins/api/proteins/P35225   (the UniProt id)
    - list is in dbReferences field, need to filter on type === "PDB"
  - alphaFold: https://alphafold.ebi.ac.uk/api/prediction/P35225

- Then to get the actual structure file: https://www.ebi.ac.uk/pdbe/entry-files/download/{identifier}.bcif
  - for the alphaFold, use -model_v4 at the end (or see what latest model is)

- currently will stick with the uniprot_swissprot test for whether to include widget
  - this will always have an alphaFold prediction - and poss no experimental

- should include some visual controls - e.g. cartoon, ball-stick

*/
