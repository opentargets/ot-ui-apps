import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { SectionItem } from "ui";
import { Box } from "@mui/material";
import Description from "./Description";
import { definition } from ".";
import VIEWER_TEST_QUERY from "./ViewerTestQuery.gql";
import { Viewer } from "ui";
import { ViewerProvider } from "ui/src/components/Viewer/Context";
import { getUniprotIds } from "@ot/utils";

function Body({ id: ensemblId, label: symbol, entity }) {
  const [structureData, setStructureData] = useState(null);

  const variables = { ensemblId };
  const request = useQuery(VIEWER_TEST_QUERY, {
    variables,
  });

  const uniprotId = request?.data?.target
    ? getUniprotIds(request?.data?.target?.proteinIds)?.[0]
    : null;

  // fetch alphaFold structure
  useEffect(() => {
    const fetchStructure = async () => {
      if (!uniprotId) return;
      const pdbUri = `https://alphafold.ebi.ac.uk/files/AF-${uniprotId}-F1-model_v4.cif`;
      let response;
      try {
        response = await fetch(pdbUri);
      } catch (error) {}
      if (response.ok) {
        setStructureData(await response.text());
      }
    };
    fetchStructure();
  }, [uniprotId]);

  function reducer(state, action) {
    return {};
  }

  return (
    <SectionItem
      definition={definition}
      entity={entity}
      request={request}
      renderDescription={() => <Description />}
      renderBody={() => {
        if (!request?.data?.target) return <></>;
        return (
          <ViewerProvider reducer={reducer} initialState={{}}>
            <Box>
              {structureData ? (
                <Viewer
                  data={[{ structureData, info: {} }]}
                  drawAppearance={[{ style: { cartoon: { color: "spectrum" } } }]}
                />
              ) : (
                "NO STRUCTURE DATA!!!"
              )}
            </Box>
          </ViewerProvider>
        );
      }}
    />
  );
}

export default Body;
