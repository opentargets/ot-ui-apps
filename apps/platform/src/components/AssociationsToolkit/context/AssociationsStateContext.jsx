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
  onPaginationChange,
  resetDataSourceControl,
  resetPagination,
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

  // Table Controls
  const [facetFilterIds, setFacetFilterIds] = useState([]);

  // Data controls
  const [enableIndirect, setEnableIndirect] = useState(initialIndirect(entity));
  const [dataSourcesRequired, setDataSourcesRequired] = useState([]);
  const [searhFilter, setSearhFilter] = useState("");
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
      filter: searhFilter,
      sortBy: sorting[0].id,
      enableIndirect,
      datasources: state.dataSourceControls,
      entity,
      aggregationFilters: dataSourcesRequired,
      facetFilters: facetFilterIds,
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
      aggregationFilters: dataSourcesRequired,
      rowsFilter: pinnedEntries.toSorted(),
      facetFilters: facetFilterIds,
    },
  });

  useEffect(() => {
    if (hasComponentBeenRender.current) {
      resetDatasourceControls();
      setActiveHeadersControlls(false);
      setSorting(DEFAULT_TABLE_SORTING_STATE);
      dispatch(resetPagination());
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

  const handleSearchInputChange = useCallback(
    newSearchFilter => {
      if (newSearchFilter !== searhFilter) {
        setSearhFilter(newSearchFilter);
      }
    },
    [searhFilter]
  );

  const resetDatasourceControls = () => {
    dispatch(resetDataSourceControl());
  };

  const resetToInitialPagination = () => {
    dispatch(resetPagination());
  };

  const updateDataSourceControls = (id, weight, required, aggregationId) => {
    dispatch(setDataSourceControl(id, weight, required, aggregationId));
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
      dataSourcesRequired,
      displayedTable,
      pinnedData,
      searhFilter,
      sorting,
      modifiedSourcesDataControls: state.modifiedSourcesDataControls,
      pinnedLoading,
      pinnedError,
      pinnedCount,
      pinnedEntries,
      facetFilterIds,
      resetToInitialPagination,
      setPinnedEntries,
      resetDatasourceControls,
      handleSortingChange,
      handleSearchInputChange,
      setDisplayedTable,
      setDataSourcesRequired,
      handlePaginationChange,
      setEnableIndirect,
      setActiveHeadersControlls,
      handleAggregationClick,
      setFacetFilterIds,
      updateDataSourceControls,
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
      handleSearchInputChange,
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
      searhFilter,
      setDisplayedTable,
      setPinnedEntries,
      sorting,
      facetFilterIds,
      setFacetFilterIds,
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
