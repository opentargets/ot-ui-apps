import { ApiPlaygroundDrawer } from "ui";
import useAotfContext from "../hooks/useAotfContext";

function AotfApiPlayground() {
  const {
    id,
    pagination,
    searhFilter,
    sorting,
    enableIndirect,
    dataSourcesWeights,
    entity,
    query,
    entitySearch,
  } = useAotfContext();

  const variables = {
    id,
    index: pagination.pageIndex,
    size: pagination.pageSize,
    filter: searhFilter,
    sortBy: sorting[0].id,
    enableIndirect,
    datasources: dataSourcesWeights.map(el => ({
      id: el.id,
      weight: el.weight,
      propagate: el.propagate,
      required: el.required,
    })),
    entity,
    entitySearch,
  };

  return (
    <ApiPlaygroundDrawer
      fullHeight={true}
      query={query.loc.source.body}
      variables={variables}
      inMenu
    />
  );
}
export default AotfApiPlayground;
