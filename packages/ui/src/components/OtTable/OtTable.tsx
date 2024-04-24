import { ReactElement, useState } from "react";
import { Box, CircularProgress, Grid, IconButton, NativeSelect, Typography } from "@mui/material";
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
import { naLabel } from "../../constants";
import OtTableSearch from "./OtTableSearch";
import { OtTableProps } from "./table.types";
import { FontAwesomeIconPadded, OtTableContainer, OtTableHeader } from "./layout";

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
  dataRows = [],
  verticalHeaders = false,
  defaultSortObj,
}: OtTableProps): ReactElement {
  const classes = useStyles();

  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: dataRows,
    columns,
    filterFns: {
      searchFilterFn: searchFilter,
    },
    state: {
      columnFilters,
      globalFilter,
    },
    initialState: {
      sorting: [{ ...defaultSortObj }],
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

  return (
    <div>
      {/* Global Search */}
      {showGlobalFilter && (
        <Grid container>
          <Grid item xs={12} lg={4}>
            <OtTableSearch setGlobalSearchTerm={setGlobalFilter} />
          </Grid>
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
                            <Typography
                              className={`${
                                verticalHeaders || header.column.columnDef.verticalHeader
                                  ? classes.verticalHeaders
                                  : ""
                              }`}
                              onClick={header.column.getToggleSortingHandler()}
                              variant="subtitle2"
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
                            </Typography>
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
                        <Typography variant="body2">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          {/* TODO: check NA value */}
                          {Boolean(flexRender(cell.column.columnDef.cell, cell.getContext())) ||
                            naLabel}
                        </Typography>
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
          padding: theme => `${theme.spacing(2)} ${theme.spacing(4)}`,
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
              <strong>
                {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </strong>
            </span>
          </div>

          <div className="paginationAction">
            <IconButton
              color="primary"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <FontAwesomeIcon size="2xs" icon={faBackwardStep} />
            </IconButton>
            <IconButton
              color="primary"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <FontAwesomeIcon size="2xs" icon={faAngleLeft} />
            </IconButton>

            <IconButton
              color="primary"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <FontAwesomeIcon size="2xs" icon={faAngleRight} />
            </IconButton>
            <IconButton
              color="primary"
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
