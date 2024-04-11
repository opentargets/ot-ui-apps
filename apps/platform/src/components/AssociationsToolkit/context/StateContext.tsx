import { createContext, useState, useMemo, useEffect, useReducer } from "react";
import { isEqual } from "lodash";
import { useStateParams } from "ui";
import dataSources from "../static_datasets/dataSourcesAssoc";
import {
  defaulDatasourcesWeigths,
  getControlChecked,
  getCellId,
  checkBoxPayload,
  ENTITIES,
  DEFAULT_TABLE_PAGINATION_STATE,
  DEFAULT_TABLE_SORTING_STATE,
  DISPLAY_MODE,
} from "../utils";

import useAssociationsData from "../hooks/useAssociationsData";

import { aotfReducer, initialState } from "./aotfReducer";

const AssociationsStateContext = createContext();

const initialIndirect = entity => entity !== ENTITIES.TARGET;

function AssociationsStateProvider({ children, entity, id, query }) {
  // TODO: State to remove
  const [dataSourcesWeights, setDataSourcesWeights] = useState(defaulDatasourcesWeigths);

  const [state, dispatch] = useReducer(aotfReducer, initialState);

  const { pagination, searchFilter, enableIndirect, pinnedEntities, sorting } = state;

  const { data, initialLoading, loading, error, count } = useAssociationsData({
    query,
    options: {
      id,
      index: state.pagination.pageIndex,
      size: state.pagination.pageSize,
      filter: searchFilter,
      sortBy: sorting[0].id,
      enableIndirect,
      datasources: dataSourcesWeights,
      entity,
      aggregationFilters: dataSourcesRequired,
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
      size: pinnedEntities.length,
      sortBy: sorting[0].id,
      datasources: dataSourcesWeights,
      aggregationFilters: dataSourcesRequired,
      rowsFilter: pinnedEntities.toSorted(),
    },
  });

  useEffect(() => {
    if (isEqual(defaulDatasourcesWeigths, dataSourcesWeights) && isEqual(dataSourcesRequired, []))
      setModifiedSourcesDataControls(false);
    else setModifiedSourcesDataControls(true);
  }, [dataSourcesWeights, dataSourcesRequired]);

  const handleAggregationClick = aggregationId => {
    const aggregationDatasources = dataSources.filter(el => el.aggregation === aggregationId);
    let isAllActive = true;
    aggregationDatasources.forEach(e => {
      if (getControlChecked(dataSourcesRequired, e.id) === false) {
        isAllActive = false;
        return;
      }
    });
    if (isAllActive) {
      let newPayload = [...dataSourcesRequired];
      aggregationDatasources.forEach(element => {
        const indexToRemove = newPayload.findIndex(datasource => datasource.id === element.id);
        const newRequiredElement = [
          ...newPayload.slice(0, indexToRemove),
          ...newPayload.slice(indexToRemove + 1),
        ];
        newPayload = [...newRequiredElement];
      });
      setDataSourcesRequired(newPayload);
    } else {
      const payload = [];
      aggregationDatasources.forEach(el => {
        if (dataSourcesRequired.filter(val => val.id === el.id).length === 0) {
          payload.push(checkBoxPayload(el.id, el.aggregationId));
        }
      });
      setDataSourcesRequired([...dataSourcesRequired, ...payload]);
    }
  };

  const entityToGet = entity === ENTITIES.TARGET ? ENTITIES.DISEASE : ENTITIES.TARGET;

  const contextVariables = useMemo(
    () => ({
      query,
      id,
      entity,
      entityToGet,
      count,
      data,
      loading,
      initialLoading,
      tableExpanded,
      pagination,
      expanded,
      activeHeadersControlls,
      enableIndirect,
      error,
      dataSourcesWeights,
      dataSourcesRequired,
      displayedTable,
      pinnedData,
      searhFilter,
      sorting,
      modifiedSourcesDataControls,
      tablePinExpanded,
      pinnedLoading,
      pinnedError,
      pinnedCount,
      pinExpanded,
      pinnedEntries,
      handleActiveRow,
      resetToInitialPagination,
      setPinnedEntries,
      setPinExpanded,
      setTablePinExpanded,
      resetDatasourceControls,
      handleSortingChange,
      handleSearchInputChange,
      setDisplayedTable,
      setDataSourcesWeights,
      setDataSourcesRequired,
      handlePaginationChange,
      expanderHandler,
      setTableExpanded,
      setEnableIndirect,
      setActiveHeadersControlls,
      resetExpandler,
      handleAggregationClick,
    }),
    [
      activeHeadersControlls,
      count,
      data,
      dataSourcesRequired,
      dataSourcesWeights,
      displayedTable,
      enableIndirect,
      entity,
      entityToGet,
      error,
      expanded,
      expanderHandler,
      handleAggregationClick,
      handleSearchInputChange,
      handleSortingChange,
      id,
      initialLoading,
      loading,
      modifiedSourcesDataControls,
      pagination,
      pinExpanded,
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
      tableExpanded,
      tablePinExpanded,
    ]
  );

  ` `;

  return (
    <AssociationsStateContext.Provider value={contextVariables}>
      {children}
    </AssociationsStateContext.Provider>
  );
}

export default AssociationsStateContext;
export { AssociationsStateProvider };
