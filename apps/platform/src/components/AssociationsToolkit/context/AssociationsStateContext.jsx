import {
  createContext,
  useState,
  useMemo,
  useEffect,
  useReducer,
  useRef,
  useCallback,
} from "react";
import { useApolloClient, useStateParams } from "ui";
import { ENTITIES, DEFAULT_TABLE_SORTING_STATE, DISPLAY_MODE } from "../associationsUtils";

import useAssociationsData from "../hooks/useAssociationsData";
import { aotfReducer, createInitialState } from "./aotfReducer";
import { METRICS_SORT_FIELD } from "../static_datasets/rowMetrics";
import {
  aggregationClick,
  facetFilterSelectAction,
  onPaginationChange,
  resetDataSourceControl,
  resetPagination,
  resetToInitialState,
  setDataSourceControl,
  setEnableIndirect,
} from "./aotfActions";
import { ActionType } from "../types";

const AssociationsStateContext = createContext();

const rowEntity = { [ENTITIES.TARGET]: ENTITIES.DISEASE, [ENTITIES.DISEASE]: ENTITIES.TARGET };

/**
 * Associations on the fly state Provider
 */
function AssociationsStateProvider({ children, entity, id, query }) {
  const [state, dispatch] = useReducer(
    aotfReducer,
    { entity },
    createInitialState
  );

  const hasComponentBeenRender = useRef(false);

  const client = useApolloClient();

  // UI-only state — not a query param, will become local state in AssociationsView
  const [activeHeadersControlls, setActiveHeadersControlls] = useState(false);

  // only two possible (associations || prioritisations)
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

  const [uploadedEntries, setUploadedEntries] = useStateParams(
    [],
    "uploaded",
    arr => arr.join(","),
    str => str.split(",")
  );

  const entityToGet = rowEntity[entity];

  const resolvedSortBy = METRICS_SORT_FIELD[state.sorting[0].id] ?? state.sorting[0].id;

  const { data, initialLoading, loading, error, count } = useAssociationsData({
    client,
    query,
    options: {
      id,
      index: state.pagination.pageIndex,
      size: state.pagination.pageSize,
      sortBy: resolvedSortBy,
      enableIndirect: state.enableIndirect,
      datasources: state.dataSourceControls,
      entity,
      facetFilters: state.facetFiltersIds,
      entitySearch: state.entitySearch,
      includeMeasurements: state.includeMeasurements,
    },
  });

  const {
    data: pinnedData,
    loading: pinnedLoading,
    error: pinnedError,
    count: pinnedCount,
  } = useAssociationsData({
    client,
    query,
    options: {
      id,
      enableIndirect: state.enableIndirect,
      entity,
      size: pinnedEntries.length,
      sortBy: resolvedSortBy,
      datasources: state.dataSourceControls,
      rowsFilter: pinnedEntries.toSorted(),
      facetFilters: state.facetFiltersIds,
      entitySearch: state.entitySearch,
      laodingCount: pinnedEntries.length,
      includeMeasurements: state.includeMeasurements,
    },
  });

  const {
    data: uploadedData,
    loading: uploadedLoading,
    error: uploadedError,
    count: uploadedCount,
  } = useAssociationsData({
    client,
    query,
    options: {
      id,
      enableIndirect: state.enableIndirect,
      entity,
      size: uploadedEntries.length,
      sortBy: resolvedSortBy,
      datasources: state.dataSourceControls,
      rowsFilter: uploadedEntries.toSorted(),
      facetFilters: state.facetFiltersIds,
      entitySearch: state.entitySearch,
      laodingCount: uploadedEntries.length,
      includeMeasurements: state.includeMeasurements,
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
    [state.pagination]
  );

  const resetSorting = useCallback(() => {
    dispatch({ type: ActionType.SORTING, sorting: DEFAULT_TABLE_SORTING_STATE });
  }, []);

  const handleSortingChange = useCallback(
    newSortingFunc => {
      const newSorting = newSortingFunc();
      if (newSorting[0].id === state.sorting[0].id) {
        dispatch({ type: ActionType.SORTING, sorting: DEFAULT_TABLE_SORTING_STATE });
        return;
      }
      dispatch({ type: ActionType.SORTING, sorting: newSorting });
    },
    [state.sorting]
  );

  const handleSetEnableIndirect = useCallback((value) => {
    dispatch(setEnableIndirect(value));
  }, []);

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
      enableIndirect: state.enableIndirect,
      error,
      dataSourcesWeights: state.dataSourceControls,
      displayedTable,
      pinnedData,
      sorting: state.sorting,
      modifiedSourcesDataControls: state.modifiedSourcesDataControls,
      entitySearch: state.entitySearch,
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
      setEnableIndirect: handleSetEnableIndirect,
      setActiveHeadersControlls,
      handleAggregationClick,
      updateDataSourceControls,
      facetFilterSelect,
      state,
      setUploadedEntries,
      uploadedData,
      uploadedLoading,
      uploadedError,
      uploadedCount,
      uploadedEntries,
      resetSorting,
    }),
    [
      setUploadedEntries,
      dispatch,
      activeHeadersControlls,
      count,
      data,
      displayedTable,
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
      handlePaginationChange,
      uploadedData,
      uploadedLoading,
      uploadedError,
      uploadedCount,
      uploadedEntries,
      resetSorting,
      handleSetEnableIndirect,
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
