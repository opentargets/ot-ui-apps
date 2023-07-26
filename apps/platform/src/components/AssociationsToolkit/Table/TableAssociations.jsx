/* eslint-disable */
import { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  createColumnHelper,
} from '@tanstack/react-table';
import Skeleton from '@material-ui/lab/Skeleton';

import { styled } from '@material-ui/styles';

import dataSourcesCols from '../static_datasets/dataSourcesAssoc';
import prioritizationCols from '../static_datasets/prioritizationCols';

import AggregationsTooltip from './AggregationsTooltip';
import ColoredCell from './ColoredCell';

import HeaderControls from '../HeaderControls';
import CellName from './CellName';
import TableHeader from './TableHeader';
import TableFooter from './TableFooter';
import TableBody from './TableBody';
import useAotfContext from '../hooks/useAotfContext';

import { cellHasValue, isPartnerPreview, tableCSSVariables } from '../utils';

const TableElement = styled('div')({
  minWidth: '900px',
  maxWidth: '1400px',
  margin: '0 auto',
});

const TableDivider = styled('div')({
  background: '#ececec',
  height: '1px',
  margin: '5px 0',
});

const columnHelper = createColumnHelper();

/* Build table columns bases on displayed table */
function getDatasources({ expanderHandler, loading, displayedTable }) {
  const isAssociations = displayedTable === 'associations';
  const baseCols = isAssociations ? dataSourcesCols : prioritizationCols;
  const dataProp = isAssociations ? 'dataSources' : 'prioritisations';
  const datasources = [];
  baseCols.forEach(
    ({
      id,
      label,
      sectionId,
      description,
      aggregation,
      isPrivate,
      docsLink,
    }) => {
      if (isPrivate && isPrivate !== isPartnerPreview) return;
      const column = columnHelper.accessor(row => row[dataProp][id], {
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
        sectionId,
        enableSorting: isAssociations,
        aggregation,
        isPrivate,
        docsLink,
        cell: row => {
          const tablePrefix = row.table.getState().prefix;
          if (loading && tablePrefix !== 'pinned')
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
              tablePrefix={tablePrefix}
            />
          ) : (
            <ColoredCell />
          );
        },
      });
      datasources.push(column);
    }
  );
  return datasources;
}

function TableAssociations() {
  const {
    entity,
    entityToGet,
    data,
    count,
    loading,
    tableExpanded,
    expanded,
    pinExpanded,
    pagination,
    expanderHandler,
    handlePaginationChange,
    setTableExpanded,
    displayedTable,
    sorting,
    handleSortingChange,
    pinnedData,
  } = useAotfContext();

  console.log({ data });

  // const [tableExpanded, setTableExpanded] = useState(null);

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
              const tablePrefix = row.table.getState().prefix;
              if (loading && tablePrefix !== 'pinned') return null;
              return (
                <CellName
                  name={row.getValue()}
                  rowId={row.row.id}
                  row={row.row}
                />
              );
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
              const tablePrefix = row.table.getState().prefix;
              if (loading && tablePrefix !== 'pinned')
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
        columns: [
          ...getDatasources({ expanderHandler, loading, displayedTable }),
        ],
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
      prefix: 'body',
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
  console.log({ pinnedData, tableExpanded });

  const tablePinned = useReactTable({
    data: pinnedData,
    columns,
    state: {
      expanded: tableExpanded,
      pagination: {
        pageIndex: 0,
        pageSize: 50,
      },
      sorting,
      prefix: 'pinned',
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

  const entitesHeaders = table.getHeaderGroups()[0].headers[1].subHeaders;

  console.log({ expanded, pinExpanded });

  return (
    <div className="TAssociations" style={tableCSSVariables}>
      <TableElement>
        {/* HEADER */}
        <TableHeader table={table} />

        {/* Weights controlls */}
        <HeaderControls cols={entitesHeaders} />

        {/* BODY CONTENT */}
        <TableBody table={tablePinned} expanded={expanded} prefix="pinned" />

        {pinnedData.length > 0 && <TableDivider />}

        <TableBody table={table} expanded={expanded} prefix="body" />

        {/* FOOTER */}
        <TableFooter table={table} />
      </TableElement>
    </div>
  );
}

export default TableAssociations;
