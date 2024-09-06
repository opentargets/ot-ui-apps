import { useEffect, useState } from "react";
import client from "../../../client";
import { getInitialLoadingData, getAssociationsData, getAllDataCount } from "../utils";

const INITIAL_ROW_COUNT = 20;

const INITIAL_USE_ASSOCIATION_STATE = {
  loading: true,
  error: false,
  data: getInitialLoadingData(INITIAL_ROW_COUNT),
  initialLoading: true,
  count: 0,
};

/********
 * HOOK *
 ********/
function useAssociationsData({
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
  },
}) {
  const [state, setState] = useState(INITIAL_USE_ASSOCIATION_STATE);

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
    if (isCurrent) fetchData();
    return () => (isCurrent = false);
  }, [id, index, size, sortBy, enableIndirect, datasources, query, entity, facetFilters]);

  return state;
}

export default useAssociationsData;
