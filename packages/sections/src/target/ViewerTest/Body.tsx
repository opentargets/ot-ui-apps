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
import { alphaFoldCifUrl, safeFetch } from "@ot/utils";

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
      const [cifData, error] = await safeFetch(alphaFoldCifUrl(uniprotId), "text");
      cifData ? setStructureData(cifData) : console.log(error);
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
                  hoverAppearance={[
                    {
                      eventSelection: {},
                      selection: (state, atom) => ({ resi: atom.resi }),
                      style: { stick: {}, sphere: { radius: 0.6 } },
                      addStyle: true,
                      unhoverSelection: (state, atom) => ({ resi: atom.resi }),
                      unhoverStyle: { stick: { hidden: true }, sphere: { hidden: true } },
                      unhoverAddStyle: true,
                    },
                  ]}
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
