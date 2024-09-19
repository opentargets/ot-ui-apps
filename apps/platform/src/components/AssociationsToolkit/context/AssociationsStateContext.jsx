import {
  createContext,
  useState,
  useMemo,
  useEffect,
  useReducer,
  useRef,
  useCallback,
} from "react";
import { useStateParams } from "ui";
import { ENTITIES, DEFAULT_TABLE_SORTING_STATE, DISPLAY_MODE } from "../utils";

import useAssociationsData from "../hooks/useAssociationsData";
import { aotfReducer, createInitialState } from "./aotfReducer";
import {
  aggregationClick,
  facetFilterSelectAction,
  onPaginationChange,
  resetDataSourceControl,
  resetPagination,
  resetToInitialState,
  setDataSourceControl,
} from "./aotfActions";

const AssociationsStateContext = createContext();

const initialIndirect = entity => entity !== ENTITIES.TARGET;
const rowEntity = { [ENTITIES.TARGET]: ENTITIES.DISEASE, [ENTITIES.DISEASE]: ENTITIES.TARGET };

/**
 * Associations on the fly state Provider
 */
function AssociationsStateProvider({ children, entity, id, query }) {
  const [state, dispatch] = useReducer(
    aotfReducer,
    { query, parentEntity: entity, parentId: id },
    createInitialState
  );

  const hasComponentBeenRender = useRef(false);

  // Data controls
  const [enableIndirect, setEnableIndirect] = useState(initialIndirect(entity));
  const [sorting, setSorting] = useState(DEFAULT_TABLE_SORTING_STATE);

  // Data controls UI
  const [activeHeadersControlls, setActiveHeadersControlls] = useState(false);

  // only two posible (associations || prioritisations)
  const [displayedTable, setDisplayedTable] = useStateParams(
    DISPLAY_MODE.ASSOCIATIONS,
    "table",
    arr => arr,
    str => str
  );

  const [pinnedEntries, setPinnedEntries] = useStateParams(
    [],
    "pinned",
    arr => arr.join(","),
    str => str.split(",")
  );

  const entityToGet = rowEntity[entity];

  const { data, initialLoading, loading, error, count } = useAssociationsData({
    query,
    options: {
      id,
      index: state.pagination.pageIndex,
      size: state.pagination.pageSize,
      sortBy: sorting[0].id,
      enableIndirect,
      datasources: state.dataSourceControls,
      entity,
      facetFilters: state.facetFilters,
    },
  });

  const {
    data: pinnedData,
    loading: pinnedLoading,
    error: pinnedError,
    count: pinnedCount,
  } = useAssociationsData({
    query,
    options: {
      id,
      enableIndirect,
      entity,
      size: pinnedEntries.length,
      sortBy: sorting[0].id,
      datasources: state.dataSourceControls,
      rowsFilter: pinnedEntries.toSorted(),
      facetFilters: state.facetFilters,
    },
  });

  useEffect(() => {
    if (hasComponentBeenRender.current) {
      dispatch(resetToInitialState());
    }
    hasComponentBeenRender.current = true;
  }, [id]);

  const handleAggregationClick = aggregation => {
    dispatch(aggregationClick(aggregation));
  };

  const handlePaginationChange = useCallback(
    updater => {
      const newPagination = updater(state.pagination);
      dispatch(onPaginationChange(newPagination));
    },
    [state]
  );

  const handleSortingChange = useCallback(
    newSortingFunc => {
      const newSorting = newSortingFunc();
      if (newSorting[0].id === sorting[0].id) {
        setSorting(DEFAULT_TABLE_SORTING_STATE);
        return;
      }
      setSorting(newSorting);
    },
    [sorting]
  );

  const resetDatasourceControls = () => {
    dispatch(resetDataSourceControl());
  };

  const resetToInitialPagination = () => {
    dispatch(resetPagination());
  };

  const updateDataSourceControls = (id, weight, required, aggregation) => {
    dispatch(setDataSourceControl(id, weight, required, aggregation));
  };

  const facetFilterSelect = facetFilters => {
    dispatch(facetFilterSelectAction(facetFilters));
  };

  const contextVariables = useMemo(
    () => ({
      dispatch,
      query,
      id,
      entity,
      entityToGet,
      count,
      data,
      loading,
      initialLoading,
      pagination: state.pagination,
      activeHeadersControlls,
      enableIndirect,
      error,
      dataSourcesWeights: state.dataSourceControls,
      displayedTable,
      pinnedData,
      sorting,
      modifiedSourcesDataControls: state.modifiedSourcesDataControls,
      pinnedLoading,
      pinnedError,
      pinnedCount,
      pinnedEntries,
      resetToInitialPagination,
      setPinnedEntries,
      resetDatasourceControls,
      handleSortingChange,
      setDisplayedTable,
      handlePaginationChange,
      setEnableIndirect,
      setActiveHeadersControlls,
      handleAggregationClick,
      updateDataSourceControls,
      facetFilterSelect,
      state,
    }),
    [
      dispatch,
      activeHeadersControlls,
      count,
      data,
      displayedTable,
      enableIndirect,
      entity,
      entityToGet,
      error,
      handleSortingChange,
      id,
      initialLoading,
      loading,
      state,
      pinnedCount,
      pinnedData,
      pinnedEntries,
      pinnedError,
      pinnedLoading,
      query,
      setDisplayedTable,
      setPinnedEntries,
      sorting,
      handlePaginationChange,
    ]
  );

  return (
    <AssociationsStateContext.Provider value={contextVariables}>
      {children}
    </AssociationsStateContext.Provider>
  );
}

export default AssociationsStateContext;
export { AssociationsStateProvider };
