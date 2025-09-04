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
import {
  aggregationClick,
  facetFilterSelectAction,
  onPaginationChange,
  resetDataSourceControl,
  resetPagination,
  resetToInitialState,
  setDataSourceControl,
  toggleExcludeMeasurementsAction,
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

  const client = useApolloClient();

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

  const [uploadedEntries, setUploadedEntries] = useStateParams(
    [],
    "uploaded",
    arr => arr.join(","),
    str => str.split(",")
  );

  const entityToGet = rowEntity[entity];

  // Process facetFilters based on excludeMeasurements checkbox
  const processedFacetFilters = useMemo(() => {
    if (state.excludeMeasurements) {
      // When excluding measurements: include all therapeutic area facet IDs except measurement ID
      const measurementId = "joI1aZcBIu-4UoxALIDa"; // Measurement therapeutic area ID
      const allTherapeuticAreaIds = [
        "F4I1aZcBIu-4UoxALGKu", // animal disease
        "GII1aZcBIu-4UoxALGKu", // disorder of visual system
        "XII1aZcBIu-4UoxALGKu", // immune system disease
        "n4I1aZcBIu-4UoxALGKu", // reproductive system or breast disease
        "DYI1aZcBIu-4UoxALKj9", // musculoskeletal or connective tissue disease
        "_4I1aZcBIu-4UoxALK7-", // genetic, familial or congenital disease
        "-II1aZcBIu-4UoxALLD-", // cancer or benign tumor
        "jYI1aZcBIu-4UoxALIDa", // medical procedure
        "EII1aZcBIu-4UoxALIHa", // cardiovascular disease
        "iYI1aZcBIu-4UoxALIHa", // pancreas disease
        "ioI1aZcBIu-4UoxALIHa", // hematologic disease
        "D4I1aZcBIu-4UoxALILa", // endocrine system disease
        "b4I1aZcBIu-4UoxALHPQ", // pregnancy or perinatal disease
        "cII1aZcBIu-4UoxALHPQ", // phenotype
        "LoI1aZcBIu-4UoxALHTQ", // injury, poisoning or other complication
        "L4I1aZcBIu-4UoxALHTQ", // gastrointestinal disease
        "cII1aZcBIu-4UoxALHTQ", // respiratory or thoracic disease
        "tII1aZcBIu-4UoxALHTQ", // psychiatric disorder
        "boI1aZcBIu-4UoxALHXQ", // nutritional or metabolic disease
        "4oI1aZcBIu-4UoxALHXQ", // disorder of ear
        "44I1aZcBIu-4UoxALHXQ", // integumentary system disease
        "IYI1aZcBIu-4UoxALHbR", // infectious disease
        "ooI1aZcBIu-4UoxALHbR", // urinary system disease
        "o4I1aZcBIu-4UoxALHbR", // biological_process
        // "joI1aZcBIu-4UoxALIDa", // measurement - EXCLUDED
      ];
      return allTherapeuticAreaIds;
    } else {
      // When including measurements: apply no facet filters (empty array)
      return [];
    }
  }, [state.excludeMeasurements]);

  const { data, initialLoading, loading, error, count } = useAssociationsData({
    client,
    query,
    options: {
      id,
      index: state.pagination.pageIndex,
      size: state.pagination.pageSize,
      sortBy: sorting[0].id,
      enableIndirect,
      datasources: state.dataSourceControls,
      entity,
      facetFilters: processedFacetFilters,
      entitySearch: state.entitySearch,
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
      enableIndirect,
      entity,
      size: pinnedEntries.length,
      sortBy: sorting[0].id,
      datasources: state.dataSourceControls,
      rowsFilter: pinnedEntries.toSorted(),
      facetFilters: processedFacetFilters,
      entitySearch: state.entitySearch,
      laodingCount: pinnedEntries.length,
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
      enableIndirect,
      entity,
      size: uploadedEntries.length,
      sortBy: sorting[0].id,
      datasources: state.dataSourceControls,
      rowsFilter: uploadedEntries.toSorted(),
      facetFilters: processedFacetFilters,
      entitySearch: state.entitySearch,
      laodingCount: uploadedEntries.length,
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

  const resetSorting = useCallback(() => {
    setSorting(DEFAULT_TABLE_SORTING_STATE);
  }, [setSorting]);

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

  const toggleExcludeMeasurements = excludeMeasurements => {
    dispatch(toggleExcludeMeasurementsAction(excludeMeasurements));
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
      setEnableIndirect,
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
      excludeMeasurements: state.excludeMeasurements,
      toggleExcludeMeasurements,
    }),
    [
      setUploadedEntries,
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
      uploadedData,
      uploadedLoading,
      uploadedError,
      uploadedCount,
      uploadedEntries,
      resetSorting,
      state.excludeMeasurements,
      toggleExcludeMeasurements,
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
