import { useEffect, useMemo, useState } from "react";
import { useReactTable, getCoreRowModel, createColumnHelper } from "@tanstack/react-table";

import { styled, Typography, Box, Collapse } from "@mui/material";

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

import {
  getScale,
  isPartnerPreview,
  tableCSSVariables,
  TABLE_PREFIX,
} from "../../associationsUtils";
import { grey } from "@mui/material/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretRight, faTrash } from "@fortawesome/free-solid-svg-icons";

const TableElement = styled("main")({
  maxWidth: "1800px",
  margin: "0 auto",
});

const TableSpacer = styled("div")({
  marginBottom: 5,
});

const getIndicatorLabel = prefix => {
  switch (prefix) {
    case TABLE_PREFIX.CORE:
      return "All";
    case TABLE_PREFIX.PINNING:
      return "Pinned";
    case TABLE_PREFIX.UPLOADED:
      return "Uploaded";
    default:
      return "";
  }
};

const getIndicatorCount = (prefix, count, filteredCount) => {
  switch (prefix) {
    case TABLE_PREFIX.CORE:
      return count;
    default:
      return `${filteredCount} of ${count}`;
  }
};

const TableIndicatorControl = ({
  prefix = "",
  open = true,
  count = 0,
  filteredCount = 0,
  onClickToggle,
  onClickDelete,
}) => {
  const label = getIndicatorLabel(prefix);
  const countLabel = getIndicatorCount(prefix, count, filteredCount);
  return (
    <Box sx={{ display: "flex", my: 1, gap: 1, alignItems: "center" }}>
      {prefix !== TABLE_PREFIX.CORE && (
        <Box onClick={onClickDelete} sx={{ color: grey[600], cursor: "pointer" }}>
          <FontAwesomeIcon size="sm" icon={faTrash} />
        </Box>
      )}
      <Box
        onClick={onClickToggle}
        sx={{
          ml: prefix === TABLE_PREFIX.CORE ? "20px" : 0,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: grey[300],
          width: "150px",
          px: "6px",
          borderRadius: "2px",
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 600 }}>
          {`${label} (${countLabel})`}
        </Typography>
        <Box ml={1}>
          {open ? <FontAwesomeIcon icon={faCaretDown} /> : <FontAwesomeIcon icon={faCaretRight} />}
        </Box>
      </Box>
    </Box>
  );
};

const columnHelper = createColumnHelper();

const evidenceViewColumns = getDatasources({
  displayedTable: "associations",
  colorScale: getScale(true),
});
const prioritisationViewColumns = getDatasources({
  displayedTable: "prioritisations",
  colorScale: getScale(false),
});

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
    uploadedData,
    uploadedLoading,
    pinnedEntries,
    uploadedEntries,
    setUploadedEntries,
    setPinnedEntries,
  } = useAotfContext();

  const rowNameEntity = entity === "target" ? "name" : "approvedSymbol";
  const isAssociations = displayedTable === "associations";
  const associationsColorScale = getScale(true);
  const [coreOpen, setCoreOpen] = useState(true);
  const [pinningOpen, setPinningOpen] = useState(true);
  const [uploadedOpen, setUploadedOpen] = useState(true);

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
        columns: isAssociations ? evidenceViewColumns : prioritisationViewColumns,
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

  const coreUploadedTable = useReactTable({
    data: uploadedData,
    columns,
    state: {
      pagination: {
        pageIndex: 0,
        pageSize: 150,
      },
      sorting,
      prefix: TABLE_PREFIX.UPLOADED,
      loading: uploadedLoading,
    },
    pageCount: count,
    onPaginationChange: handlePaginationChange,
    onSortingChange: handleSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getRowId: row => row[entityToGet].id,
    manualPagination: true,
    manualSorting: true,
  });

  useEffect(() => {
    if (uploadedEntries.length > 0) {
      setCoreOpen(false);
      setUploadedOpen(true);
    }
    if (uploadedEntries.length === 0) {
      setCoreOpen(true);
    }
  }, [uploadedEntries]);

  useEffect(() => {
    if (pinnedData.length === 0 && uploadedData.length === 0) {
      setCoreOpen(true);
    }
  }, [pinnedData, uploadedData]);

  const onClickPinnedIndicator = () => {
    setPinningOpen(!pinningOpen);
  };
  const onClickUploadedIndicator = () => {
    setUploadedOpen(!uploadedOpen);
  };
  const onClickCoreIndicator = () => {
    setCoreOpen(!coreOpen);
  };

  const onClickPinnedDeleteAll = () => {
    setPinnedEntries([]);
  };
  const onClickUploadedDeleteAll = () => {
    setUploadedEntries([]);
  };

  const entitesHeaders = coreAssociationsTable.getHeaderGroups()[0].headers[1].subHeaders;
  return (
    <div className="TAssociations" style={tableCSSVariables}>
      <TableElement>
        {/* HEADER */}
        <TableHeader table={coreAssociationsTable} cols={entitesHeaders} />

        {/* Weights controlls */}
        <HeaderControls cols={entitesHeaders} />

        <TableSpacer />

        {/* Pinning */}
        {pinnedEntries.length > 0 && (
          <TableIndicatorControl
            prefix={TABLE_PREFIX.PINNING}
            count={pinnedEntries.length}
            filteredCount={corePinnedTable.getRowCount()}
            open={pinningOpen}
            onClickToggle={onClickPinnedIndicator}
            onClickDelete={onClickPinnedDeleteAll}
          />
        )}
        {pinnedData.length > 0 && pinnedEntries.length > 0 && (
          <Collapse in={pinningOpen}>
            <TableBody core={corePinnedTable} prefix={TABLE_PREFIX.PINNING} cols={entitesHeaders} />
          </Collapse>
        )}
        {/* Upload */}
        {uploadedEntries.length > 0 && (
          <TableIndicatorControl
            prefix={TABLE_PREFIX.UPLOADED}
            count={uploadedEntries.length}
            filteredCount={coreUploadedTable.getRowCount()}
            open={uploadedOpen}
            onClickToggle={onClickUploadedIndicator}
            onClickDelete={onClickUploadedDeleteAll}
          />
        )}
        {coreUploadedTable.getRowCount() > 0 && uploadedEntries.length > 0 && (
          <Collapse in={uploadedOpen}>
            <TableBody
              core={coreUploadedTable}
              prefix={TABLE_PREFIX.UPLOADED}
              cols={entitesHeaders}
            />
          </Collapse>
        )}
        {/* Core */}
        {(uploadedEntries.length > 0 || pinnedEntries.length > 0) && (
          <TableIndicatorControl
            prefix={TABLE_PREFIX.CORE}
            count={count}
            open={coreOpen}
            onClickToggle={onClickCoreIndicator}
          />
        )}

        {coreOpen && (
          <TableBody
            core={coreAssociationsTable}
            prefix={TABLE_PREFIX.CORE}
            cols={entitesHeaders}
          />
        )}

        {/* FOOTER */}
        <TableFooter table={coreAssociationsTable} coreOpen={coreOpen} />
      </TableElement>
    </div>
  );
}

export default TableAssociations;
