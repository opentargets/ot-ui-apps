import { useContext, Fragment, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  flexRender,
} from '@tanstack/react-table';
import Skeleton from '@material-ui/lab/Skeleton';
import { Reorder, motion } from 'framer-motion';

import { styled } from '@material-ui/styles';

import dataSources from './dataSourcesAssoc';

import { AssociationsContext } from '../provider';
import ColoredCell from '../ColoredCell';
import AggregationsRow from './AggregationsRow';
import SecctionRender from './SectionRender';
import WeightsControlls from './WeightsControlls';
import { Legend, assocScale } from '../utils';

const AssociationsLegend = Legend(assocScale, {
  title: 'Association score',
  tickFormat: '.1f',
});

const TableElement = styled('div')({
  minWidth: '1250px',
  maxWidth: '1500px',
  margin: '0 auto',
});

const NameContainer = styled('div')({
  display: 'block',
  overflow: 'hidden',
  textAlign: 'end',
  textOverflow: 'ellipsis',
  maxWidth: '300px',
});

const Name = styled('span')({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
});

const getCellId = (cell, entityToGet) => {
  const sourceId = cell.column.id;
  const rowId = cell.row.original[entityToGet].id;
  return [sourceId, rowId];
};

function TableAssociations() {
  const {
    id,
    entity,
    entityToGet,
    data,
    count,
    loading,
    expanded,
    gScoreRect,
    scoreRect,
    tableExpanded,
    pagination,
    expanderHandler,
    handlePaginationChange,
    setTableExpanded,
    activeAggregationsLabels,
  } = useContext(AssociationsContext);

  const rowNameEntity = entity === 'target' ? 'name' : 'approvedSymbol';

  function getDatasources() {
    return dataSources.map(({ id, label }) => ({
      id,
      header: label,
      accessorFn: row => row[id],
      cell: row => {
        if (loading)
          return <Skeleton variant="circle" width={26} height={25} />;
        return row.getValue() ? (
          <ColoredCell
            scoreId={id}
            scoreValue={row.getValue()}
            onClick={expanderHandler(row.row.getToggleExpandedHandler())}
            rounded={!scoreRect}
            cell={row}
            loading={loading}
            isAssociations
          />
        ) : (
          <ColoredCell rounded={!scoreRect} />
        );
      },
    }));
  }

  const columns = [
    {
      accessorFn: row => row[entityToGet][rowNameEntity],
      id: 'name',
      cell: row => (
        <NameContainer>
          <Name>{row.getValue()}</Name>
        </NameContainer>
      ),
      header: () => <span>{entityToGet}</span>,
      footer: props => props.column.id,
    },
    {
      accessorFn: row => row.score,
      id: 'score',
      cell: row => {
        if (loading) return <Skeleton variant="rect" width={30} height={25} />;
        return (
          <ColoredCell
            scoreValue={row.getValue()}
            globalScore
            rounded={!gScoreRect}
            isAssociations
          />
        );
      },
      header: () => <span>Score</span>,
      footer: props => props.column.id,
    },
    ...getDatasources(),
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      expanded: tableExpanded,
      pagination,
    },
    pageCount: count,
    onPaginationChange: handlePaginationChange,
    onExpandedChange: setTableExpanded,
    getRowCanExpand: () => true,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowId: row => row[entityToGet].id,
    manualPagination: true,
  });

  const getHeaderClassName = ({ id }) => {
    if (id === 'name') return 'header-name';
    if (id === 'score') return 'rotate header-score';
    return 'rotate';
  };

  const getRowClassName = ({ getIsExpanded }) => {
    let activeClass = getIsExpanded() ? 'active' : '';
    return `data-row ${activeClass}`;
  };
  const getCellClassName = cell => {
    if (cell.column.id === 'name') return 'name-cell';
    const expandedId = getCellId(cell, entityToGet).join('-');
    if (expandedId === expanded.join('-')) return 'active data-cell';
    return 'data-cell';
  };

  useEffect(() => {
    // DomRender(AssociationsLegend, document.getElementById('legend'))
    document.getElementById('legend').appendChild(AssociationsLegend);
  }, []);

  return (
    <div className="TAssociations">
      <div id="legend" />
      <TableElement>
        {/* HEADER */}
        {table.getHeaderGroups().map(headerGroup => {
          return (
            <div className="Theader" key={headerGroup.id}>
              <div className="cols-container">
                {headerGroup.headers.map(header => {
                  return (
                    <div className={getHeaderClassName(header)} key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {activeAggregationsLabels && (
                <AggregationsRow cols={headerGroup.headers} />
              )}
            </div>
          );
        })}

        {/* Weights controlls */}
        <WeightsControlls cols={table.getHeaderGroups()} />

        {/* CONTENT */}
        <Reorder.Group
          as="div"
          values={table.getRowModel().rows}
          onReorder={() => {}}
        >
          <div className="TBody">
            <div>
              {table.getRowModel().rows.map(row => {
                return (
                  <Fragment key={row.id}>
                    <Reorder.Item
                      as="div"
                      key={row.id}
                      value={row}
                      className={getRowClassName(row)}
                      drag={false}
                    >
                      {row.getVisibleCells().map(cell => {
                        return (
                          <div key={cell.id} className={getCellClassName(cell)}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </div>
                        );
                      })}
                    </Reorder.Item>
                    {row.getIsExpanded() && (
                      <motion.div
                        key={`${row.original[entityToGet].id}-${expanded[0]}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <SecctionRender
                          id={id}
                          rowId={row.original[entityToGet].id}
                          activeSection={expanded}
                          entity={entity}
                        />
                      </motion.div>
                    )}
                  </Fragment>
                );
              })}
            </div>
          </div>
        </Reorder.Group>
      </TableElement>
      <select
        value={table.getState().pagination.pageSize}
        onChange={e => {
          table.setPageSize(Number(e.target.value));
        }}
      >
        {[10, 25, 50, 200, 500].map(pageSize => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>
      <button
        className="border rounded p-1"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        {'<'}
      </button>
      <button
        className="border rounded p-1"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        {'>'}
      </button>
    </div>
  );
}

export default TableAssociations;
