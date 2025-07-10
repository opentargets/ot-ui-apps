import { useQuery } from "@apollo/client";
import { SectionItem } from "ui";
import { Box, Grid } from "@mui/material";
import Description from "./Description";
import { definition } from ".";
import VIEWER_TEST_QUERY from "./ViewerTest.gql";
import Viewer from "ui";
import { ViewerProvider } from "ui/src/components/Viewer/Context";

const alphaFoldResultsStem = "https://alphafold.ebi.ac.uk/api/prediction/";

function Body({ id: ensemblId, label: symbol, entity }) {
  [structureData, setStructureData] = useState(null);
  
  const variables = { ensemblId };
  const request = useQuery(VIEWER_TEST_QUERY, {
    variables,
  });

  const uniprotId = request?.data?.target
    ? getUniprotIds(request?.data?.target?.proteinIds)?.[0]
    : null;

  // fetch alphaFold structure
  useEffect(async () => {
    const pdbUri = `https://alphafold.ebi.ac.uk/files/AF-${uniprotId}-F1-model_v4.cif`;
    let response;
    try {
      const response = await fetch(pdbUri);
      if (response?.ok) return response;
    } catch (error) {}
    if (response) {
      setStructureData(await alphaFoldResponse.text());
    }
  }, []);

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
          <ViewerProvider
            reducer={reducer}
            initialState={{}}
            // initialState={{
            //   data: {request.data.target},
            // }}
          >
            <Box>
              {structureData
                ? <Viewer 
                    data={[{ structureData, info: {} }]}
                    appearance={[{ style: {'cartoon': {'color':'spectrum'}} }]}
                  />
                : "NO STRUCTURE DATA!!!"
              />}
            </Box>
          </ViewerProvider>
        );
      }}
    />
  );
}

export default Body;