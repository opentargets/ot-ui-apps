import { useMemo } from "react";
import { useReactTable, getCoreRowModel, createColumnHelper } from "@tanstack/react-table";

import { styled, Typography, Box } from "@mui/material";

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

import { getScale, isPartnerPreview, tableCSSVariables, TABLE_PREFIX } from "../../utils";

const TableElement = styled("main")({
  maxWidth: "1800px",
  margin: "0 auto",
});

const TableSpacer = styled("div")({
  marginBottom: 5,
});

const TableDivider = styled("div")({
  borderBottom: "1px solid #cecece",
  marginBottom: 10,
  marginTop: 5,
});

const columnHelper = createColumnHelper();

/* Build table columns bases on displayed table */
function getDatasources({ displayedTable, colorScale }) {
  const isAssociations = displayedTable === "associations";
  const baseCols = isAssociations ? dataSourcesCols : prioritizationCols;
  const dataProp = isAssociations ? "dataSources" : "prioritisations";
  const datasources = [];
  baseCols.forEach(({ id, label, sectionId, description, aggregation, isPrivate, docsLink }) => {
    if (isPrivate && isPrivate !== isPartnerPreview) return;
    const column = columnHelper.accessor(row => row[dataProp][id], {
      id,
      sectionId,
      enableSorting: isAssociations,
      aggregation,
      isPrivate,
      docsLink,
      header: isAssociations ? (
        <Typography variant="assoc_header">{label}</Typography>
      ) : (
        <AggregationsTooltip title={description} placement="right">
          <div className="cursor-help">
            <Typography variant="assoc_header">{label}</Typography>
          </div>
        </AggregationsTooltip>
      ),
      cell: cell => (
        <TableCell cell={cell} colorScale={colorScale} displayedTable={displayedTable} />
      ),
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
    pagination,
    handlePaginationChange,
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
        columns: [...getDatasources({ displayedTable, colorScale })],
      }),
    ],
    [displayedTable, entityToGet, rowNameEntity]
  );

  /**
   * TABLE HOOK
   * @description tanstack/react-table
   */
  const coreAssociationsTable = useReactTable({
    data,
    columns,
    state: {
      pagination,
      sorting,
      prefix: TABLE_PREFIX.CORE,
      loading: associationsLoading,
    },
    pageCount: count,
    onPaginationChange: handlePaginationChange,
    onSortingChange: handleSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getRowId: row => row[entityToGet].id,
    manualPagination: true,
    manualSorting: true,
  });

  const corePinnedTable = useReactTable({
    data: pinnedData,
    columns,
    state: {
      pagination: {
        pageIndex: 0,
        pageSize: 150,
      },
      sorting,
      prefix: TABLE_PREFIX.PINNING,
      loading: pinnedLoading,
    },
    pageCount: count,
    onPaginationChange: handlePaginationChange,
    onSortingChange: handleSortingChange,
    getCoreRowModel: getCoreRowModel(),
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

        <TableSpacer />

        {/* BODY CONTENT */}
        {pinnedEntries.length > 0 && (
          <TableBody core={corePinnedTable} prefix={TABLE_PREFIX.PINNING} cols={entitesHeaders} />
        )}

        {pinnedEntries.length > 0 && <TableDivider />}

        <TableBody core={coreAssociationsTable} prefix={TABLE_PREFIX.CORE} cols={entitesHeaders} />

        {/* FOOTER */}
        <TableFooter table={coreAssociationsTable} />
      </TableElement>
    </div>
  );
}

export default TableAssociations;
