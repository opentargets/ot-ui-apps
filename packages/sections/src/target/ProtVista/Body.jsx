import { SectionItem, usePlatformApi, OtTable } from "ui";
import { Box } from "@mui/material";
import { naLabel } from "../../constants";
import Description from "./Description";
import { definition } from ".";
import { getUniprotIds } from "../../utils/global";
import ProtVista from "./ProtVista";

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
  useEffect(() => {}, [selectedId]);

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
            <Box ref="viewerRef" width="800px" height="600px" />
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
