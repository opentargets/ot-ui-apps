import { createContext, useState, useMemo } from 'react';
import dataSources from '../dataSourcesAssoc';

import useAssociationsData from '../useAssociationsData';

const AssociationsContext = createContext();

const getCellId = cell => {
  const sourceId = cell.column.id;
  const diseaseId = cell.row.original.disease.id;
  return [sourceId, diseaseId];
};

const defaulDatasourcesWeigths = dataSources.map(({ id, weight }) => ({
  id,
  weight,
  propagate: true,
}));

function AssociationsProvider({ ensgId, children }) {
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
  const [enableIndirect, setEnableIndirect] = useState(false);
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
  const [vizControllsopen, setVizControllsOpen] = useState(false);

  const { data, initialLoading, loading, error } = useAssociationsData({
    ensemblId: ensgId,
    index: pageIndex,
    size: pageSize,
    filter: '',
    sortBy: 'score',
    enableIndirect,
    datasources: dataSourcesWeights,
  });

  const handlePaginationChange = pagination => {
    setTableExpanded({});
    setExpanded([]);
    setPagination(pagination);
  };

  const expanderHandler = tableExpanderController => cell => {
    const expandedId = getCellId(cell);
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

  return (
    <AssociationsContext.Provider
      value={{
        id: ensgId,
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
        vizControllsopen,
        enableIndirect,
        error,
        dataSourcesWeights,
        defaulDatasourcesWeigths,
        setDataSourcesWeights,
        handlePaginationChange,
        expanderHandler,
        setTableExpanded,
        setEnableIndirect,
        setActiveWeightsControlls,
        setActiveAggregationsLabels,
        setGScoreRect,
        setScoreRect,
        setVizControllsOpen,
      }}
    >
      {children}
    </AssociationsContext.Provider>
  );
}

export default AssociationsProvider;
export { AssociationsContext };
