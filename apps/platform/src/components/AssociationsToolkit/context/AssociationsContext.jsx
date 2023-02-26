import { createContext, useState, useMemo } from 'react';
import dataSources from '../static_datasets/dataSourcesAssoc';
import '../style.css';

import useAssociationsData from '../hooks/useAssociationsData';

import { getCellId } from '../utils';

const AssociationsContext = createContext();

const defaulDatasourcesWeigths = dataSources.map(({ id, weight }) => ({
  id,
  weight,
  propagate: true,
}));

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
  const [searhFilter, setSearhFilter] = useState('');
  const [sorting, setSorting] = useState([{ id: 'score', desc: true }]);

  // Data controls UI
  const [activeWeightsControlls, setActiveWeightsControlls] = useState(false);

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
    },
  });

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
        activeWeightsControlls,
        enableIndirect,
        error,
        dataSourcesWeights,
        defaulDatasourcesWeigths,
        displayedTable,
        pinnedData,
        searhFilter,
        sorting,
        handleSortingChange,
        handleSearchInputChange,
        setPinnedData,
        setDisplayedTable,
        setDataSourcesWeights,
        handlePaginationChange,
        expanderHandler,
        setTableExpanded,
        setEnableIndirect,
        setActiveWeightsControlls,
        resetExpandler,
      }}
    >
      {children}
    </AssociationsContext.Provider>
  );
}

export default AssociationsContext;
export { AssociationsProvider };
