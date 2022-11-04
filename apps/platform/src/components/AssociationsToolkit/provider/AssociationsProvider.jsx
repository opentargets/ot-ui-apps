import { createContext, useState, useMemo } from 'react';
import dataSources from '../association/dataSourcesAssoc';
import '../style.css';

import useAssociationsData from '../useAssociationsData';

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
  // Data controls UI
  const [activeWeightsControlls, setActiveWeightsControlls] = useState(false);
  const [activeAggregationsLabels, setActiveAggregationsLabels] =
    useState(true);

  // Viz Controls
  const [gScoreRect, setGScoreRect] = useState(true);
  const [scoreRect, setScoreRect] = useState(false);
  // only two posible (associations || prioritisations)
  const [displayedTable, setDisplayedTable] = useState('associations');

  const { data, initialLoading, loading, error, count } = useAssociationsData({
    query,
    options: {
      id,
      index: pageIndex,
      size: pageSize,
      filter: '',
      sortBy: 'score',
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
        id,
        entity,
        entityToGet,
        count,
        data,
        loading,
        initialLoading,
        gScoreRect,
        scoreRect,
        tableExpanded,
        pagination,
        expanded,
        activeWeightsControlls,
        activeAggregationsLabels,
        enableIndirect,
        error,
        dataSourcesWeights,
        defaulDatasourcesWeigths,
        displayedTable,
        setDisplayedTable,
        setDataSourcesWeights,
        handlePaginationChange,
        expanderHandler,
        setTableExpanded,
        setEnableIndirect,
        setActiveWeightsControlls,
        setActiveAggregationsLabels,
        setGScoreRect,
        setScoreRect,
        resetExpandler,
      }}
    >
      {children}
    </AssociationsContext.Provider>
  );
}

export default AssociationsProvider;
export { AssociationsContext };
