import { ApiPlaygroundDrawer } from "ui";
import useAotfContext from "./hooks/useAotfContext";

function AotfApiPlayground() {
  const {
    id,
    pagination,
    searhFilter,
    sorting,
    enableIndirect,
    dataSourcesWeights,
    entity,
    dataSourcesRequired,
    query,
  } = useAotfContext();

  const aggregationFilters = dataSourcesRequired.map(({ id, ...obj }) => ({ ...obj }));

  console.log("AotfApiPlayground -> QUERY", query);
  const variables = {
    id,
    index: pagination.pageIndex,
    size: pagination.pageSize,
    filter: searhFilter,
    sortBy: sorting[0].id,
    enableIndirect,
    datasources: dataSourcesWeights,
    entity,
    aggregationFilters,
  };

  return <ApiPlaygroundDrawer query={query.loc.source.body} variables={variables} />;
}
export default AotfApiPlayground;
