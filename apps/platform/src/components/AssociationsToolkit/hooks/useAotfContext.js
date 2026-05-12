import { useAotfQueryState, useAotfQueryDispatch } from "../context/AssociationsQueryContext";
import { useAotfURLState } from "../context/AssociationsURLContext";
import { useAotfData } from "../context/AssociationsDataContext";

/**
 * Compatibility shim — assembles the same context shape that components previously
 * consumed from AssociationsStateContext. Consumers should migrate to the specific
 * hooks (useAotfQueryState, useAotfQueryDispatch, useAotfURLState, useAotfData).
 */
export default function useAotfContext() {
  const queryState = useAotfQueryState();
  const queryDispatch = useAotfQueryDispatch();
  const urlState = useAotfURLState();
  const dataState = useAotfData();

  return {
    // entity config
    id: queryState.id,
    entity: queryState.entity,
    entityToGet: queryState.entityToGet,
    query: queryState.query,
    state: queryState,

    // query params
    sorting: queryState.sorting,
    enableIndirect: queryState.enableIndirect,
    pagination: queryState.pagination,
    dataSourcesWeights: queryState.dataSourceControls,
    modifiedSourcesDataControls: queryState.modifiedSourcesDataControls,
    entitySearch: queryState.entitySearch,

    // dispatchers
    dispatch: queryDispatch.dispatch,
    handlePaginationChange: queryDispatch.handlePaginationChange,
    handleSortingChange: queryDispatch.handleSortingChange,
    resetSorting: queryDispatch.resetSorting,
    handleAggregationClick: queryDispatch.handleAggregationClick,
    resetDatasourceControls: queryDispatch.resetDatasourceControls,
    resetToInitialPagination: queryDispatch.resetToInitialPagination,
    updateDataSourceControls: queryDispatch.updateDataSourceControls,
    facetFilterSelect: queryDispatch.facetFilterSelect,
    setEnableIndirect: queryDispatch.setEnableIndirect,

    // url state
    displayedTable: urlState.displayedTable,
    setDisplayedTable: urlState.setDisplayedTable,
    pinnedEntries: urlState.pinnedEntries,
    setPinnedEntries: urlState.setPinnedEntries,
    uploadedEntries: urlState.uploadedEntries,
    setUploadedEntries: urlState.setUploadedEntries,

    // data
    data: dataState.data,
    loading: dataState.loading,
    initialLoading: dataState.initialLoading,
    error: dataState.error,
    count: dataState.count,
    pinnedData: dataState.pinnedData,
    pinnedLoading: dataState.pinnedLoading,
    pinnedError: dataState.pinnedError,
    pinnedCount: dataState.pinnedCount,
    uploadedData: dataState.uploadedData,
    uploadedLoading: dataState.uploadedLoading,
    uploadedError: dataState.uploadedError,
    uploadedCount: dataState.uploadedCount,
  };
}
