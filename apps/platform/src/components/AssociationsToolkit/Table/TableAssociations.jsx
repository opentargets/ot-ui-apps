import { Fragment, useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import Skeleton from '@material-ui/lab/Skeleton';

import { styled } from '@material-ui/styles';
import { ClickAwayListener } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowDownWideShort,
  faBook,
} from '@fortawesome/free-solid-svg-icons';

import dataSourcesCols from '../static_datasets/dataSourcesAssoc';
import prioritizationCols from '../static_datasets/prioritizationCols';

import AggregationsTooltip from './AggregationsTooltip';
import ColoredCell from './ColoredCell';
import SquareCell from './SquareCell';
import AggregationsRow from './AggregationsRow';
import {
  EvidenceSecctionRenderer,
  SecctionRendererWrapper,
  TargetSecctionRenderer,
} from './SectionRender';
import WeightsControl from '../WeightsControl';
import CellName from './CellName';
import TableFooter from './TableFooter';
import useAotfContext from '../hooks/useAotfContext';

import { getCellId, cellHasValue, tableCSSVariables } from '../utils';

const TableElement = styled('div')({
  minWidth: '900px',
  maxWidth: '1400px',
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

  return baseCols.map(({ id, label, sectionId, description, aggregation }) => {
    return columnHelper.accessor(row => row[dataProp][id], {
      id,
      header: isAssociations ? (
        <div className="">{label}</div>
      ) : (
        <AggregationsTooltip title={description} placement="right">
          <div className="cursor-help">
            <span>{label}</span>
          </div>
        </AggregationsTooltip>
      ),
      sectionId: sectionId,
      enableSorting: isAssociations,
      aggregation,
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
    sorting,
    handleSortingChange,
  } = useAotfContext();

  const [activeAggregation, setActiveAggegation] = useState(null);

  const isAssociations = displayedTable === 'associations';

  const rowNameEntity = entity === 'target' ? 'name' : 'approvedSymbol';

  const columns = useMemo(
    () => [
      columnHelper.group({
        header: 'header',
        id: 'naiming-cols',
        columns: [
          columnHelper.accessor(row => row[entityToGet][rowNameEntity], {
            id: 'name',
            enableSorting: false,
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
            header: 'Association Score',
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
      sorting,
    },
    pageCount: count,
    onPaginationChange: handlePaginationChange,
    onExpandedChange: setTableExpanded,
    onSortingChange: handleSortingChange,
    getRowCanExpand: () => true,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowId: row => row[entityToGet].id,
    manualPagination: true,
    manualSorting: true,
  });

  const highLevelHeaders = table.getHeaderGroups()[0].headers;
  const entitesHeaders = table.getHeaderGroups()[0].headers[1].subHeaders;

  const handleClickAway = cell => {
    resetExpandler();
  };

  const onEnterHoverHeader = ({ id, column }) => {
    if (id === 'score' || id === 'name') return;
    const aggregation = column.columnDef.aggregation;
    setActiveAggegation(aggregation);
  };

  const onLeaveHoverHeader = () => {
    if (id === 'score' || id === 'name') return;
    setActiveAggegation(null);
  };

  return (
    <div className="TAssociations" style={tableCSSVariables}>
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
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? 'cursor-pointer select-none'
                            : '',
                        }}
                        onMouseEnter={e => onEnterHoverHeader(header)}
                        onMouseLeave={e => onLeaveHoverHeader()}
                      >
                        <div
                          {...{
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                        {{
                          desc: (
                            <FontAwesomeIcon
                              className="header-desc-icon"
                              icon={faArrowDownWideShort}
                            />
                          ),
                        }[header.column.getIsSorted()] ?? null}
                        <a
                          rel="noreferrer"
                          target="_blank"
                          className="docs-link"
                          href={`https://platform-docs.opentargets.org/evidence#${header.id}`}
                        >
                          <FontAwesomeIcon
                            className="header-desc-icon"
                            icon={faBook}
                          />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <AggregationsRow
            cols={entitesHeaders}
            table={displayedTable}
            active={activeAggregation}
          />
        </div>

        {/* Weights controlls */}
        <WeightsControl cols={entitesHeaders} />

        {/* BODY CONTENT */}
        <div>
          <div className="TBody">
            <div className="TRow">
              {table.getRowModel().rows.map(row => {
                return (
                  <Fragment key={row.id}>
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
                    {row.getIsExpanded() && (
                      <div
                        key={`${row.original[entityToGet].id}-${expanded[0]}`}
                      >
                        <ClickAwayListener onClickAway={handleClickAway}>
                          <div>
                            <SecctionRendererWrapper
                              activeSection={expanded}
                              table={displayedTable}
                            >
                              {isAssociations ? (
                                <EvidenceSecctionRenderer
                                  id={id}
                                  rowId={row.original[entityToGet].id}
                                  entity={entity}
                                  label={
                                    row.original[entityToGet][rowNameEntity]
                                  }
                                />
                              ) : (
                                <TargetSecctionRenderer
                                  id={id}
                                  rowId={row.original[entityToGet].id}
                                  entity={entity}
                                  label={
                                    row.original[entityToGet][rowNameEntity]
                                  }
                                />
                              )}
                            </SecctionRendererWrapper>
                          </div>
                        </ClickAwayListener>
                      </div>
                    )}
                  </Fragment>
                );
              })}
            </div>
          </div>
        </div>
        <TableFooter table={table} />
      </TableElement>
    </div>
  );
}

export default TableAssociations;
