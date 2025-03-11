import { useEffect, useState } from "react";
import { getInitialLoadingData, getAssociationsData, getAllDataCount } from "../associationsUtils";

const INITIAL_ROW_COUNT = 25;

const getInitialState = rowCount => ({
  loading: true,
  error: false,
  data: getInitialLoadingData(rowCount),
  initialLoading: true,
  count: 0,
});

/********
 * HOOK *
 ********/
function useAssociationsData({
  client,
  query,
  options: {
    id = "",
    index = 0,
    size = 50,
    filter = "",
    sortBy = "score",
    enableIndirect = false,
    datasources = [],
    rowsFilter = [],
    entity,
    facetFilters = [],
    entitySearch = "",
    laodingCount = INITIAL_ROW_COUNT,
  },
}) {
  const [state, setState] = useState(getInitialState(laodingCount));
  useEffect(() => {
    let isCurrent = true;
    const fetchData = async () => {
      setState({
        ...state,
        loading: true,
      });
      const resData = await client.query({
        query,
        variables: {
          id,
          index,
          size,
          filter,
          sortBy,
          enableIndirect,
          datasources: datasources.map(el => ({
            id: el.id,
            weight: el.weight,
            propagate: el.propagate,
            required: el.required,
          })),
          rowsFilter,
          facetFilters,
          entitySearch,
        },
      });
      const parsedData = getAssociationsData(entity, resData.data);
      const dataCount = getAllDataCount(entity, resData.data);

      setState({
        count: dataCount,
        data: parsedData,
        loading: false,
        initialLoading: false,
      });
    };
    if (true) fetchData();
    return () => (isCurrent = false);
  }, [
    id,
    index,
    size,
    sortBy,
    enableIndirect,
    datasources,
    query,
    entity,
    facetFilters,
    entitySearch,
  ]);

  return state;
}

export default useAssociationsData;
