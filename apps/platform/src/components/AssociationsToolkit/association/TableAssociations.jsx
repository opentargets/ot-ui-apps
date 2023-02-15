import { Fragment, useEffect, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import Skeleton from '@material-ui/lab/Skeleton';
// import { Reorder, motion } from 'framer-motion';

import { styled } from '@material-ui/styles';
import { TablePagination, ClickAwayListener } from '@material-ui/core';

import dataSourcesCols from '../static_datasets/dataSourcesAssoc';
import prioritizationCols from '../static_datasets/prioritizationCols';

import ColoredCell from '../ColoredCell';
import AggregationsRow from './AggregationsRow';
import SecctionRender from './SectionRender';
import WeightsControlls from './WeightsControlls';
import CellName from './CellName';

import useAotfContext from '../hooks/useAotfContext';

import { getLegend, getCellId, cellHasValue } from '../utils';

const TableElement = styled('div')({
  minWidth: '1000px',
  maxWidth: '1800px',
  margin: '0 auto',
});

/* HELPERS */
/* Columns classnames helpters */
const getHeaderContainerClassName = ({ id }) => {
  if (id === '1_naiming-cols_name') return 'naiming-cols';
  return 'entity-cols';
};

const getColContainerClassName = ({ id }) => {
  if (id === '1_naiming-cols_name') return 'group-naiming-cols';
  return 'group-entity-cols';
};

const getHeaderClassName = ({ id }) => {
  if (id === 'name') return 'header-name';
  if (id === 'score') return 'rotate header-score';
  return 'rotate';
};

const getRowClassName = ({ getIsExpanded }) => {
  let activeClass = getIsExpanded() ? 'active' : '';
  return `data-row ${activeClass}`;
};

const getCellClassName = (cell, entityToGet, displayedTable, expanded) => {
  if (cell.column.id === 'name') return 'name-cell';
  const expandedId = getCellId(cell, entityToGet, displayedTable).join('-');
  if (expandedId === expanded.join('-')) return 'active data-cell';
  return 'data-cell';
};

const columnHelper = createColumnHelper();

/* Build table columns bases on displayed table */
function getDatasources(expanderHandler, loading, displayedTable) {
  const isAssociations = displayedTable === 'associations';
  const baseCols = isAssociations ? dataSourcesCols : prioritizationCols;
  const dataProp = isAssociations ? 'dataSources' : 'prioritisations';

  return baseCols.map(({ id, label }) => {
    return columnHelper.accessor(row => row[dataProp][id], {
      id,
      header: label,
      cell: row => {
        if (loading)
          return <Skeleton variant="circle" width={26} height={25} />;
        const hasValue = cellHasValue(row.getValue());
        return hasValue ? (
          <ColoredCell
            hasValue
            scoreId={id}
            scoreValue={row.getValue()}
            onClick={expanderHandler(row.row.getToggleExpandedHandler())}
            cell={row}
            loading={loading}
            isAssociations={isAssociations}
          />
        ) : (
          <ColoredCell />
        );
      },
    });
  });
}

function TableAssociations() {
  const {
    id,
    entity,
    entityToGet,
    data,
    count,
    loading,
    expanded,
    tableExpanded,
    pagination,
    expanderHandler,
    handlePaginationChange,
    setTableExpanded,
    displayedTable,
    resetExpandler,
  } = useAotfContext();

  const rowNameEntity = entity === 'target' ? 'name' : 'approvedSymbol';

  const columns = useMemo(
    () => [
      columnHelper.group({
        header: 'header',
        id: 'naiming-cols',
        columns: [
          columnHelper.accessor(row => row[entityToGet][rowNameEntity], {
            id: 'name',
            cell: row => {
              return !loading ? (
                <CellName name={row.getValue()} rowId={row.row.id} />
              ) : null;
            },
            header: () => {
              const label = entityToGet === 'target' ? 'Target' : 'Disease';
              return <span>{label}</span>;
            },
          }),
          columnHelper.accessor(row => row.score, {
            id: 'score',
            header: 'Score',
            cell: row => {
              if (loading)
                return <Skeleton variant="rect" width={30} height={25} />;
              return (
                <ColoredCell
                  scoreValue={row.getValue()}
                  globalScore
                  rounded={false}
                  isAssociations
                  hasValue
                />
              );
            },
          }),
        ],
      }),
      columnHelper.group({
        header: 'entities',
        id: 'entity-cols',
        columns: [...getDatasources(expanderHandler, loading, displayedTable)],
      }),
    ],
    [expanderHandler, loading, displayedTable, entityToGet, rowNameEntity]
  );

  /**
   * TABLE HOOK
   * @description tanstack/react-table
   */
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

  const highLevelHeaders = table.getHeaderGroups()[0].headers;
  const entitesHeaders = table.getHeaderGroups()[0].headers[1].subHeaders;

  const handleClickAway = cell => {
    resetExpandler();
  };

  /**
   * LEGEND EFECT
   */
  useEffect(() => {
    const Legend = getLegend(displayedTable === 'associations');
    document.getElementById('legend').innerHTML = '';
    document.getElementById('legend').appendChild(Legend);
  }, [displayedTable]);

  return (
    <div className="TAssociations">
      <TableElement>
        {/* HEADER */}
        <div className="Theader">
          <div className="cols-container">
            {highLevelHeaders.map(highLevelHeader => (
              <div
                className={getHeaderContainerClassName(highLevelHeader)}
                key={highLevelHeader.id}
              >
                {highLevelHeader.subHeaders.map(header => (
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
                ))}
              </div>
            ))}
          </div>
          <AggregationsRow cols={entitesHeaders} table={displayedTable} />
        </div>

        {/* Weights controlls */}
        <WeightsControlls cols={entitesHeaders} />

        {/* CONTENT */}
        {/* <Reorder.Group
          as="div"
          className="table-body"
          values={table.getRowModel().rows}
          onReorder={() => {}}
        > */}
        <div>
          <div className="TBody">
            <div className="TRow">
              {table.getRowModel().rows.map(row => {
                return (
                  <Fragment key={row.id}>
                    {/* <Reorder.Item
                      as="div"
                      key={row.id}
                      value={row}
                      className={getRowClassName(row)}
                      drag={false}
                    > */}
                    <div className={getRowClassName(row)}>
                      <div className="data-row-content">
                        {highLevelHeaders.map(columnGroup => {
                          return (
                            <div
                              className={getColContainerClassName(columnGroup)}
                              key={columnGroup.id}
                            >
                              {columnGroup.subHeaders.map(column => {
                                const cell = row
                                  .getVisibleCells()
                                  .find(el => el.column.id === column.id);
                                return (
                                  <div
                                    key={cell.id}
                                    className={getCellClassName(
                                      cell,
                                      entityToGet,
                                      displayedTable,
                                      expanded
                                    )}
                                  >
                                    {flexRender(
                                      cell.column.columnDef.cell,
                                      cell.getContext()
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {/* </Reorder.Item> */}
                    {row.getIsExpanded() && (
                      // <motion.div
                      //   key={`${row.original[entityToGet].id}-${expanded[0]}`}
                      //   initial={{ opacity: 0 }}
                      //   animate={{ opacity: 1 }}
                      //   exit={{ opacity: 0 }}
                      // >
                      <div
                        key={`${row.original[entityToGet].id}-${expanded[0]}`}
                      >
                        <ClickAwayListener onClickAway={handleClickAway}>
                          <div>
                            <SecctionRender
                              id={id}
                              rowId={row.original[entityToGet].id}
                              activeSection={expanded}
                              entity={entity}
                              label={row.original[entityToGet][rowNameEntity]}
                            />
                          </div>
                        </ClickAwayListener>
                      </div>
                      // </motion.div>
                    )}
                  </Fragment>
                );
              })}
            </div>
          </div>
        </div>
        {/* </Reorder.Group> */}
        <div className="table-footer">
          <div id="legend" />
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 200, 500]}
            component="div"
            count={count}
            rowsPerPage={table.getState().pagination.pageSize}
            page={pagination.pageIndex}
            onPageChange={(e, index) => {
              if (!loading) {
                table.setPageIndex(index);
              }
            }}
            onRowsPerPageChange={e => {
              if (!loading) {
                return table.setPageSize(Number(e.target.value));
              }
            }}
          />
        </div>
      </TableElement>
    </div>
  );
}

export default TableAssociations;
