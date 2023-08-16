import { createContext, useState, useMemo, useEffect } from 'react';
import { isEqual } from 'lodash';
import { useStateParams } from 'ui';
import {
  defaulDatasourcesWeigths,
  getControlChecked,
  getCellId,
  checkBoxPayload,
} from '../utils';
import dataSources from '../static_datasets/dataSourcesAssoc';
import '../style.css';

import useAssociationsData from '../hooks/useAssociationsData';

const AssociationsContext = createContext();

const initialIndirect = entity => entity !== 'target';

function AssociationsProvider({ children, entity, id, query }) {
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
  });

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  // Table Controls
  const [expanded, setExpanded] = useState([]);
  const [pinExpanded, setPinExpanded] = useState([]);
  const [tableExpanded, setTableExpanded] = useState({});
  const [tablePinExpanded, setTablePinExpanded] = useState({});

  // Data controls8
  const [enableIndirect, setEnableIndirect] = useState(initialIndirect(entity));
  const [dataSourcesWeights, setDataSourcesWeights] = useState(
    defaulDatasourcesWeigths
  );
  const [dataSourcesRequired, setDataSourcesRequired] = useState([]);
  const [modifiedSourcesDataControls, setModifiedSourcesDataControls] =
    useState(false);
  const [searhFilter, setSearhFilter] = useState('');
  const [sorting, setSorting] = useState([{ id: 'score', desc: true }]);

  // Data controls UI
  const [activeHeadersControlls, setActiveHeadersControlls] = useState(false);

  // only two posible (associations || prioritisations)
  const [displayedTable, setDisplayedTable] = useStateParams(
    'associations',
    'table',
    arr => arr,
    str => str
  );

  const [pinnedEntries, setPinnedEntries] = useStateParams(
    [],
    'pinned',
    arr => arr.join(','),
    str => str.split(',')
  );

  const { data, initialLoading, loading, error, count } = useAssociationsData({
    query,
    options: {
      id,
      index: pageIndex,
      size: pageSize,
      filter: searhFilter,
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
      size: pinnedEntries.length,
      sortBy: sorting[0].id,
      enableIndirect,
      datasources: dataSourcesWeights,
      entity,
      aggregationFilters: dataSourcesRequired,
      rowsFilter: pinnedEntries.toSorted(),
    },
  });

  useEffect(() => {
    if (
      isEqual(defaulDatasourcesWeigths, dataSourcesWeights) &&
      isEqual(dataSourcesRequired, [])
    )
      setModifiedSourcesDataControls(false);
    else setModifiedSourcesDataControls(true);
  }, [dataSourcesWeights, dataSourcesRequired]);

  const handleAggregationClick = aggregationId => {
    const aggregationDatasources = dataSources.filter(
      el => el.aggregation === aggregationId
    );
    let isAllActive = true;
    aggregationDatasources.forEach(e => {
      if (getControlChecked(dataSourcesRequired, e.id) === false) {
        isAllActive = false;
      }
    });
    if (isAllActive) {
      let newPayload = [...dataSourcesRequired];
      aggregationDatasources.forEach(element => {
        const indexToRemove = newPayload.findIndex(
          datasource => datasource.id === element.id
        );
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

  const entityToGet = entity === 'target' ? 'disease' : 'target';

  const handlePaginationChange = newPagination => {
    setTableExpanded({});
    setExpanded([]);
    setPagination(newPagination);
  };

  const handleSortingChange = newSortingFunc => {
    const newSorting = newSortingFunc();
    if (newSorting[0].id === sorting[0].id) {
      setSorting([{ id: 'score', desc: true }]);
      return;
    }
    setSorting(newSorting);
  };

  const handleSearchInputChange = newSearchFilter => {
    if (newSearchFilter !== searhFilter) {
      setSearhFilter(newSearchFilter);
    }
  };

  const expanderHandler = tableExpanderController => (cell, tablePrefix) => {
    const expandedId = getCellId(
      cell,
      entityToGet,
      displayedTable,
      tablePrefix
    );
    if (expanded.join('-') === expandedId.join('-')) {
      setTableExpanded({});
      setExpanded([]);
      return;
    }
    /* Validate that only one row can be expanded */
    if (Object.keys(tableExpanded).length > 0) setTableExpanded({});
    /* Open the expandable section */
    tableExpanderController();
    /* Set the ID of the section expanded element */
    setExpanded(expandedId);
  };

  const resetDatasourceControls = () => {
    setDataSourcesWeights(defaulDatasourcesWeigths);
    setDataSourcesRequired([]);
  };

  const resetExpandler = () => {
    setExpanded([]);
    setTableExpanded({});
  };

  const contextVariables = useMemo(() => ({
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
  }));

  return (
    <AssociationsContext.Provider value={contextVariables}>
      {children}
    </AssociationsContext.Provider>
  );
}

export default AssociationsContext;
export { AssociationsProvider };
