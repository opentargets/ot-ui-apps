/* eslint-disable */
import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  createColumnHelper,
} from "@tanstack/react-table";

import { styled, Skeleton, Typography, Box } from "@mui/material";

import dataSourcesCols from "../../static_datasets/dataSourcesAssoc";
import prioritizationCols from "../../static_datasets/prioritisationColumns";

import AggregationsTooltip from "./AssocTooltip";
import TableCell from "./TableCell";

import HeaderControls from "../HeaderControls";
import CellName from "./CellName";
import TableHeader from "./TableHeader";
import TableFooter from "./TableFooter";
import TableBody from "./TableBody";
import useAotfContext from "../../hooks/useAotfContext";

import { cellHasValue, getScale, isPartnerPreview, tableCSSVariables } from "../../utils";

const TableElement = styled("main")({
  maxWidth: "1600px",
  margin: "0 auto",
});

const TableDivider = styled("div")({
  borderBottom: "1px solid #ececec",
  marginBottom: 4,
});

const columnHelper = createColumnHelper();

/* Build table columns bases on displayed table */
function getDatasources({ expanderHandler, displayedTable, colorScale }) {
  const isAssociations = displayedTable === "associations";
  const baseCols = isAssociations ? dataSourcesCols : prioritizationCols;
  const dataProp = isAssociations ? "dataSources" : "prioritisations";
  const datasources = [];
  baseCols.forEach(({ id, label, sectionId, description, aggregation, isPrivate, docsLink }) => {
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
      cell: cell => {
        const hasValue = cellHasValue(cell.getValue());
        return hasValue ? (
          <TableCell
            hasValue
            displayedTable={displayedTable}
            scoreId={id}
            scoreValue={cell.getValue()}
            onClick={expanderHandler(cell.row.getToggleExpandedHandler())}
            cell={cell}
            isAssociations={isAssociations}
            colorScale={colorScale}
          />
        ) : (
          <TableCell cell={cell} />
        );
      },
    });
    datasources.push(column);
  });
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
    pagination,
    expanderHandler,
    handlePaginationChange,
    setTableExpanded,
    displayedTable,
    sorting,
    handleSortingChange,
    pinnedData,
    pinnedLoading,
    pinnedEntries,
  } = useAotfContext();

  const rowNameEntity = entity === "target" ? "name" : "approvedSymbol";
  const isAssociations = displayedTable === "associations";
  const colorScale = getScale(isAssociations);
  const associationsColorScale = getScale(true);

  const columns = useMemo(
    () => [
      columnHelper.group({
        header: "header",
        id: "naiming-cols",
        columns: [
          columnHelper.accessor(row => row[entityToGet][rowNameEntity], {
            id: "name",
            enableSorting: false,
            cell: cell => {
              return <CellName cell={cell} colorScale={associationsColorScale} />;
            },
            header: () => {
              const label = entityToGet === "target" ? "Target" : "Disease";
              return <Typography variant="assoc_header">{label}</Typography>;
            },
          }),
          columnHelper.accessor(row => row.score, {
            id: "score",
            header: <Typography variant="assoc_header">Association Score</Typography>,
            cell: cell => (
              <Box sx={{ marginRight: "10px" }}>
                <TableCell
                  scoreValue={cell.getValue()}
                  globalScore
                  shape="rectangular"
                  colorScale={associationsColorScale}
                  cell={cell}
                />
              </Box>
            ),
          }),
        ],
      }),
      columnHelper.group({
        header: "entities",
        id: "entity-cols",
        columns: [...getDatasources({ expanderHandler, displayedTable, colorScale })],
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
      prefix: "body",
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
      prefix: "pinned",
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

  const entitesHeaders = coreAssociationsTable.getHeaderGroups()[0].headers[1].subHeaders;

  return (
    <div className="TAssociations" style={tableCSSVariables}>
      <TableElement>
        {/* HEADER */}
        <TableHeader table={coreAssociationsTable} cols={entitesHeaders} />

        {/* Weights controlls */}
        <HeaderControls cols={entitesHeaders} />

        {/* BODY CONTENT */}
        {pinnedEntries.length > 0 && (
          <TableBody core={corePinnedTable} prefix="pinned" cols={entitesHeaders} />
        )}

        {pinnedEntries.length > 0 && <TableDivider />}

        <TableBody core={coreAssociationsTable} prefix="body" cols={entitesHeaders} />

        {/* FOOTER */}
        <TableFooter table={coreAssociationsTable} />
      </TableElement>
    </div>
  );
}

export default TableAssociations;
