import { useEffect, useState } from "react";
import {
  ENTITIES,
  getInitialLoadingData,
  getAssociationsData,
  getAllDataCount,
} from "../associationsUtils";
import {
  loadExternalPrioritisationLookup,
  mergeExternalPrioritisationRows,
} from "../associationsUtils/externalPrioritisation";

const INITIAL_ROW_COUNT = 25;

const getInitialState = rowCount => ({
  loading: true,
  error: false,
  data: getInitialLoadingData(rowCount),
  initialLoading: true,
  count: 0,
});

const getRowsFilterKey = rowsFilter => JSON.stringify(rowsFilter);

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
    includeMeasurements = false,
  },
}) {
  const [state, setState] = useState(getInitialState(laodingCount));
  const rowsFilterKey = getRowsFilterKey(rowsFilter);

  useEffect(() => {
    let isCurrent = true;

    const fetchData = async () => {
      setState(previousState => ({
        ...previousState,
        loading: true,
      }));

      try {
        const [resData, externalPrioritisationLookup] = await Promise.all([
          client.query({
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
              includeMeasurements,
            },
          }),
          entity === ENTITIES.DISEASE
            ? loadExternalPrioritisationLookup()
            : Promise.resolve(new Map()),
        ]);

        if (!isCurrent) return;

        const parsedData = getAssociationsData(entity, resData.data);
        const mergedData = mergeExternalPrioritisationRows(
          parsedData,
          externalPrioritisationLookup
        );
        const dataCount = getAllDataCount(entity, resData.data);

        setState({
          count: dataCount,
          data: mergedData,
          loading: false,
          initialLoading: false,
          error: false,
        });
      } catch (error) {
        if (!isCurrent) return;

        setState(previousState => ({
          ...previousState,
          loading: false,
          initialLoading: false,
          error,
        }));
      }
    };

    if (true) fetchData();

    return () => {
      isCurrent = false;
    };
  }, [
    id,
    index,
    size,
    sortBy,
    enableIndirect,
    datasources,
    query,
    entity,
    rowsFilterKey,
    facetFilters,
    entitySearch,
    includeMeasurements,
  ]);

  return state;
}

export default useAssociationsData;
