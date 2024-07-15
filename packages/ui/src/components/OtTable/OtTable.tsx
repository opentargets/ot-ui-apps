import { ReactElement, useState } from "react";
import { Box, CircularProgress, Grid, IconButton, NativeSelect } from "@mui/material";
import {
  useReactTable,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  FilterFn,
  flexRender,
  getFacetedUniqueValues,
} from "@tanstack/react-table";
import {
  faAngleLeft,
  faAngleRight,
  faArrowUp,
  faArrowDown,
  faForwardStep,
  faBackwardStep,
} from "@fortawesome/free-solid-svg-icons";

import { makeStyles } from "@mui/styles";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import OtTableColumnFilter from "./OtTableColumnFilter";
// import { naLabel } from "../../constants";
import OtTableSearch from "./OtTableSearch";
import { OtTableProps } from "./table.types";
import { FontAwesomeIconPadded, OtTableContainer, OtTableHeader } from "./otTableLayout";
import DataDownloader from "../DataDownloader";
import { getDefaultSortObj, mapTableColumnToTanstackColumns } from "./tableUtil";

const useStyles = makeStyles(theme => ({
  stickyColumn: {
    left: "0",
    position: "sticky",
    backgroundColor: theme.palette.grey[100],
    zIndex: 1,
  },
  verticalHeaders: {
    writingMode: "vertical-rl",
    transform: "rotate(180deg)",
    // TODO: TBC
    maxHeight: "20rem",
    height: "14rem",
  },
}));

declare module "@tanstack/table-core" {
  interface FilterFns {
    searchFilterFn: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

const searchFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

function OtTable({
  showGlobalFilter = true,
  tableDataLoading = false,
  columns = [],
  rows = [],
  verticalHeaders = false,
  order,
  sortBy,
  dataDownloader,
  dataDownloaderColumns,
  dataDownloaderFileStem,
  query,
  variables,
}: OtTableProps): ReactElement {
  const classes = useStyles();

  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const mappedColumns = mapTableColumnToTanstackColumns(columns);

  const table = useReactTable({
    data: rows,
    columns: mappedColumns,
    filterFns: {
      searchFilterFn: searchFilter,
    },
    state: {
      columnFilters,
      globalFilter,
    },
    initialState: {
      sorting: [getDefaultSortObj(sortBy, order)],
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: searchFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  /*********************************************
   *     CALCULATE RESULTS ON CURRENT PAGE     *
   *            FROM TOTAL RESULTS             *
   * EXAMPLE RETURN 31-40 OF 45 || 41-45 OF 45 *
   *********************************************/

  function getCurrentPagePosition() {
    const { pageIndex, pageSize } = table.getState().pagination;
    const currentPageStartRange = pageIndex * pageSize + 1;
    const currentPageEndRange = pageIndex * pageSize + pageSize;
    const pageEndResultSize = Math.min(currentPageEndRange, table.getGroupedRowModel().rows.length);

    return `${currentPageStartRange} - ${pageEndResultSize} of ${
      table.getGroupedRowModel().rows.length
    }`;
  }

  return (
    <div>
      {/* Global Search */}
      {showGlobalFilter && (
        <Grid container>
          <Grid item sm={12} md={4}>
            <OtTableSearch setGlobalSearchTerm={setGlobalFilter} />
          </Grid>
          {dataDownloader && (
            <Grid item sm={12} md={8} sx={{ ml: "auto" }}>
              <DataDownloader
                columns={dataDownloaderColumns || columns}
                rows={rows}
                fileStem={dataDownloaderFileStem}
                query={query}
                variables={variables}
              />
            </Grid>
          )}
        </Grid>
      )}
      {/* Table component container */}
      <Box sx={{ w: 1, overflowX: "auto", marginTop: theme => theme.spacing(3) }}>
        {/* Table component */}
        <OtTableContainer>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className={`${header.column.columnDef.sticky ? classes.stickyColumn : ""}`}
                    >
                      {header.isPlaceholder ? null : (
                        <>
                          <OtTableHeader canBeSorted={header.column.getCanSort()}>
                            <Box
                              className={`${
                                verticalHeaders || header.column.columnDef.verticalHeader
                                  ? classes.verticalHeaders
                                  : ""
                              }`}
                              onClick={header.column.getToggleSortingHandler()}
                              sx={{
                                typography: "subtitle2",
                              }}
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {!header.column.getIsSorted() && header.column.getCanSort() && (
                                <FontAwesomeIcon
                                  size="sm"
                                  icon={faArrowUp}
                                  className="sortableColumn"
                                />
                              )}
                              {{
                                asc: <FontAwesomeIconPadded size="sm" icon={faArrowUp} />,
                                desc: <FontAwesomeIconPadded size="sm" icon={faArrowDown} />,
                              }[header.column.getIsSorted() as string] ?? null}
                            </Box>
                            {header.column.getCanFilter() ? (
                              <OtTableColumnFilter column={header.column} />
                            ) : null}
                          </OtTableHeader>
                        </>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => {
                    return (
                      <td
                        key={cell.id}
                        className={cell.column.columnDef.sticky ? classes.stickyColumn : ""}
                      >
                        <Box sx={{ typography: "body2" }}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          {/* TODO: check NA value */}
                          {/* {Boolean(flexRender(cell.column.columnDef.cell, cell.getContext())) ||
                            naLabel} */}
                        </Box>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </OtTableContainer>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          padding: theme => `${theme.spacing(2)} 0 ${theme.spacing(4)}`,
        }}
      >
        {tableDataLoading && <CircularProgress sx={{ mx: theme => theme.spacing(2) }} size={25} />}
        <div>
          <span>Rows per page:</span>
          <NativeSelect
            disableUnderline
            sx={{ pl: theme => theme.spacing(2) }}
            value={table.getState().pagination.pageSize}
            onChange={e => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 25, 100].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </NativeSelect>
        </div>

        {/*
         ************************
         * TABLE FOOTER ACTIONS *
         ************************
         */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: theme => theme.spacing(3),
            marginLeft: theme => theme.spacing(3),
          }}
        >
          <div>
            <span>Page </span>
            <span>
              <strong>{getCurrentPagePosition()}</strong>
            </span>
          </div>

          <div className="paginationAction">
            <IconButton
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <FontAwesomeIcon size="2xs" icon={faBackwardStep} />
            </IconButton>
            <IconButton onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              <FontAwesomeIcon size="2xs" icon={faAngleLeft} />
            </IconButton>

            <IconButton onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              <FontAwesomeIcon size="2xs" icon={faAngleRight} />
            </IconButton>
            <IconButton
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <FontAwesomeIcon size="2xs" icon={faForwardStep} />
            </IconButton>
          </div>
        </Box>
      </Box>
    </div>
  );
}

export default OtTable;
