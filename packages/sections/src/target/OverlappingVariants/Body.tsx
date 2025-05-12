import { useQuery } from "@apollo/client";
import { SectionItem } from "ui";
import Description from "./Description";
import { definition } from ".";
import OVERLAPPING_VARIANTS_QUERY from "./OverlappingVariantsQuery.gql";
import { StateProvider } from "./Context";
import Filters from "./Filters";
import OverlappingVariantsTable from "./OverlappingVariantsTable";

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
            {/* <div id="Viewer"></div> */}
            <Filters />
            <OverlappingVariantsTable />
          </StateProvider>
        );
      }}
    />
  );
}

export default Body;
