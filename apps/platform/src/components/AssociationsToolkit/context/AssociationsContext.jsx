import { createContext, useState, useMemo, useEffect } from 'react';
import { defaulDatasourcesWeigths, getControlChecked } from '../utils';
import { isEqual } from 'lodash';
import dataSources from '../static_datasets/dataSourcesAssoc';
import '../style.css';

import useAssociationsData from '../hooks/useAssociationsData';

import { getCellId, checkBoxPayload } from '../utils';

const AssociationsContext = createContext();

const initialIndirect = entity => (entity === 'target' ? false : true);

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
  const [tableExpanded, setTableExpanded] = useState({});

  // Data controls
  const [enableIndirect, setEnableIndirect] = useState(initialIndirect(entity));
  const [dataSourcesWeights, setDataSourcesWeights] = useState(
    defaulDatasourcesWeigths
  );
  const [dataSourcesRequired, setDataSourcesRequired] = useState([]);
  const [modifiedSourcesWeights, setModifiedSourcesWeights] = useState(false);
  const [searhFilter, setSearhFilter] = useState('');
  const [sorting, setSorting] = useState([{ id: 'score', desc: true }]);

  // Data controls UI
  const [activeHeadersControlls, setActiveHeadersControlls] = useState(false);

  // only two posible (associations || prioritisations)
  const [displayedTable, setDisplayedTable] = useState('associations');

  const [pinnedData, setPinnedData] = useState([]);

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

  useEffect(() => {
    if (isEqual(defaulDatasourcesWeigths, dataSourcesWeights))
      setModifiedSourcesWeights(false);
    else setModifiedSourcesWeights(true);
  }, [dataSourcesWeights]);

  const handleAggregationClick = aggregationId => {
    const aggregationDatasources = dataSources.filter(
      el => el.aggregation === aggregationId
    );
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

  const handlePaginationChange = pagination => {
    setTableExpanded({});
    setExpanded([]);
    setPagination(pagination);
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

  const expanderHandler = tableExpanderController => cell => {
    const expandedId = getCellId(cell, entityToGet, displayedTable);
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

  const resetExpandler = () => {
    setExpanded([]);
    setTableExpanded({});
  };

  return (
    <AssociationsContext.Provider
      value={{
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
        modifiedSourcesWeights,
        handleSortingChange,
        handleSearchInputChange,
        setPinnedData,
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
      }}
    >
      {children}
    </AssociationsContext.Provider>
  );
}

export default AssociationsContext;
export { AssociationsProvider };
