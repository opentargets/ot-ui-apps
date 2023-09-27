/* eslint-disable */
import { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  createColumnHelper,
} from '@tanstack/react-table';

import { styled, Skeleton, Typography } from '@mui/material';

import dataSourcesCols from '../static_datasets/dataSourcesAssoc';
import prioritizationCols from '../static_datasets/prioritizationCols';

import AggregationsTooltip from './AssocTooltip';
import ColoredCell from './ColoredCell';

import HeaderControls from '../HeaderControls';
import CellName from './CellName';
import TableHeader from './TableHeader';
import TableFooter from './TableFooter';
import TableBody from './TableBody';
import useAotfContext from '../hooks/useAotfContext';

import { cellHasValue, isPartnerPreview, tableCSSVariables } from '../utils';

const TableElement = styled('main')({
  maxWidth: '1600px',
  margin: '0 auto',
});

const TableDivider = styled('div')({
  borderBottom: '1px solid #ececec',
  marginBottom: 4,
});

const columnHelper = createColumnHelper();

/* Build table columns bases on displayed table */
function getDatasources({ expanderHandler, displayedTable }) {
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
          <Typography variant="assoc_header">{label}</Typography>
        ) : (
          <AggregationsTooltip title={description} placement="right">
            <div className="cursor-help">
              <Typography variant="assoc_header">{label}</Typography>
            </div>
          </AggregationsTooltip>
        ),
        sectionId,
        enableSorting: isAssociations,
        aggregation,
        isPrivate,
        docsLink,
        cell: row => {
          const { prefix, loading } = row.table.getState();
          if (loading)
            return <Skeleton variant="circular" width={26} height={26} />;
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
              tablePrefix={prefix}
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
    loading: associationsLoading,
    tableExpanded,
    expanded,
    pagination,
    expanderHandler,
    handlePaginationChange,
    setTableExpanded,
    displayedTable,
    sorting,
    handleSortingChange,
    pinnedData,
    pinnedLoading,
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
            enableSorting: false,
            cell: row => {
              const { loading, prefix } = row.table.getState();
              if (loading) return null;
              return (
                <CellName
                  name={row.getValue()}
                  rowId={row.row.id}
                  row={row.row}
                  tablePrefix={prefix}
                />
              );
            },
            header: () => {
              const label = entityToGet === 'target' ? 'Target' : 'Disease';
              return <Typography variant="assoc_header">{label}</Typography>;
            },
          }),
          columnHelper.accessor(row => row.score, {
            id: 'score',
            header: (
              <Typography variant="assoc_header">Association Score</Typography>
            ),
            cell: row => {
              const { loading } = row.table.getState();
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
        columns: [...getDatasources({ expanderHandler, displayedTable })],
      }),
    ],
    [expanderHandler, displayedTable, entityToGet, rowNameEntity]
  );

  /**
   * TABLE HOOK
   * @description tanstack/react-table
   */
  const coreAssociationsTable = useReactTable({
    data,
    columns,
    state: {
      expanded: tableExpanded,
      pagination,
      sorting,
      prefix: 'body',
      loading: associationsLoading,
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

  const corePinnedTable = useReactTable({
    data: pinnedData,
    columns,
    state: {
      expanded: tableExpanded,
      pagination: {
        pageIndex: 0,
        pageSize: 150,
      },
      sorting,
      prefix: 'pinned',
      loading: pinnedLoading,
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

  const entitesHeaders =
    coreAssociationsTable.getHeaderGroups()[0].headers[1].subHeaders;

  return (
    <div className="TAssociations" style={tableCSSVariables}>
      <TableElement>
        {/* HEADER */}
        <TableHeader table={coreAssociationsTable} cols={entitesHeaders} />

        {/* Weights controlls */}
        <HeaderControls cols={entitesHeaders} />
        <div>
          {/* BODY CONTENT */}
          <TableBody
            core={corePinnedTable}
            expanded={expanded}
            prefix="pinned"
            cols={entitesHeaders}
          />

          {pinnedData.length > 0 && <TableDivider />}

          <TableBody
            core={coreAssociationsTable}
            expanded={expanded}
            prefix="body"
            cols={entitesHeaders}
          />
        </div>
        {/* FOOTER */}
        <TableFooter table={coreAssociationsTable} />
      </TableElement>
    </div>
  );
}

export default TableAssociations;
