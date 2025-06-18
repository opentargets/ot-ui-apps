import { useQuery } from "@apollo/client";
import { SectionItem } from "ui";
import Description from "./Description";
import { definition } from ".";
import OVERLAPPING_VARIANTS_QUERY from "./OverlappingVariantsQuery.gql";
import { StateProvider } from "./Context";
import Viewer from "./Viewer";
import Filters from "./Filters";
import Table from "./Table";
import { Box } from "@mui/material";

function Body({ id: ensemblId, label: symbol, entity }) {
  // const [molViewer, setMolViewer] = useState(null);

  const variables = { ensemblId };
  const request = useQuery(OVERLAPPING_VARIANTS_QUERY, {
    variables,
  });

  return (
    <SectionItem
      definition={definition}
      entity={entity}
      request={request}
      renderDescription={() => <Description symbol={symbol} />}
      renderBody={() => {
        if (!request?.data?.target) return <></>;
        return (
          <StateProvider
            data={request.data.target}
            query={OVERLAPPING_VARIANTS_QUERY.loc.source.body}
            variables={variables}
          >
            <Filters />
            <Box display="flex" gap={2} my={3}>
              <Box width="60%">
                <Table />
              </Box>
              <Box width="40%">
                <Viewer />
              </Box>
            </Box>
          </StateProvider>
        );
      }}
    />
  );
}

export default Body;
