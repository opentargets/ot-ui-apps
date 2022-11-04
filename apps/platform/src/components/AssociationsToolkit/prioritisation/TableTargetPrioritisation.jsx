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
import { TablePagination, ClickAwayListener } from '@material-ui/core';

import priorityCols from './prioritizationCols';

import { AssociationsContext } from '../provider';
import ColoredCell from '../ColoredCell';
import CategoryRow from './AggregationsRow';
import SectionRender from './SectionRender';

import { Legend, prioritizationScale, getCellId } from '../utils';

const PrioritisationLegend = Legend(prioritizationScale, {
  title: 'Prioritisation indicator',
  tickFormat: (d, i) => ['Negative', ' ', ' ', ' ', ' ', 'Positive'][i],
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

function TableTargetPrioritization() {
  const {
    id,
    data,
    count,
    entity,
    entityToGet,
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
    displayedTable,
    resetExpandler,
  } = useContext(AssociationsContext);

  const rowNameEntity = entity === 'target' ? 'name' : 'approvedSymbol';

  function getPrioritization() {
    return priorityCols.map(({ id, label, sectionId }) => ({
      id,
      sectionId,
      header: label,
      accessorFn: row => row.prioritisations[id],
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
            isAssociations={false}
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
          />
        );
      },
      header: () => <span>Score</span>,
      footer: props => props.column.id,
    },
    ...getPrioritization(),
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
    meta: { priorityCols },
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
    const expandedId = getCellId(cell, entityToGet, displayedTable).join('-');
    if (expandedId === expanded.join('-')) return 'active data-cell';
    return 'data-cell';
  };

  const handleClickAway = cell => {
    resetExpandler();
  };

  useEffect(() => {
    // DomRender(AssociationsLegend, document.getElementById('legend'))
    document.getElementById('legend').appendChild(PrioritisationLegend);
  }, []);

  return (
    <div className="TAssociations">
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
                <CategoryRow cols={headerGroup.headers} />
              )}
            </div>
          );
        })}

        {/* CONTENT */}
        <Reorder.Group
          as="div"
          className="table-body"
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
                        <ClickAwayListener onClickAway={handleClickAway}>
                          <div>
                            <SectionRender
                              id={id}
                              rowId={row.original[entityToGet].id}
                              activeSection={expanded}
                              entity={entity}
                            />
                          </div>
                        </ClickAwayListener>
                      </motion.div>
                    )}
                  </Fragment>
                );
              })}
            </div>
          </div>
        </Reorder.Group>
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

export default TableTargetPrioritization;
