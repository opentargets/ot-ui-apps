import {
  useReactTable,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel,
  FilterFn,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";

import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";

import OtTableColumnFilter from "./OtTableColumnFilter";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
  faMagnifyingGlass,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";

import { Grid, IconButton, Input, InputAdornment, NativeSelect, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

import OtTableLoader from "./OtTableLoader";
import { useEffect, useState } from "react";
import { naLabel } from "../../constants";

const useStyles = makeStyles(theme => ({
  OtTableContainer: {
    // backgroundColor: "white",
  },
  tableContainer: {
    width: "100%",
    overflowX: "auto",
    marginTop: "2rem",
  },
  table: {
    whiteSpace: "nowrap",
    borderCollapse: "collapse",
    minWidth: "100%",
    "& thead": {
      "& tr": {
        "&:hover": {
          backgroundColor: "transparent",
        },
        "&:first-child:not(:last-child)": {
          "& th:not(:last-child)": {
            borderRight: `1px solid ${theme.palette.grey[300]}`,
          },
        },
      },
    },
    "& tr": {
      // update broder color
      borderBottom: `1px solid ${theme.palette.grey[300]}`,
      "&:hover": {
        backgroundColor: "#f6f6f6",
      },
      "& td": {
        padding: "0.25rem 0.5rem",
      },
      "& th": {
        padding: "1rem 0.5rem",
      },
    },
  },
  tableControls: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.5rem 1rem",
  },
  rowsControls: {
    display: "flex",
    alignItems: "center",
    gap: "2rem",
  },
  searchAllColumn: {
    width: "100%",
  },
  tableColumnHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    "& .sortableColumn": {
      visibility: "hidden",
      padding: "0 0.4rem",
    },
    "&:hover .sortableColumn": {
      visibility: "visible",
      opacity: "0.5",
    },
  },
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
  cursorPointer: {
    cursor: "pointer",
  },
  cursorAuto: {
    cursor: "auto",
  },
  sortIcon: {
    padding: "0 0.4rem",
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
  allColumns = [],
  allData = [],
  verticalHeaders = false,
}) {
  const classes = useStyles();

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = [...allColumns];

  const [data, setData] = useState<any[]>([...allData]);

  const table = useReactTable({
    data,
    columns,
    // enableColumnFilters: false,
    filterFns: {
      searchFilterFn: searchFilter,
    },
    state: {
      columnFilters,
      globalFilter,
    },
    // initialState: {
    //   sorting: [
    //     {
    //       id: "drugType",
    //       desc: true, // sort by name in descending order by default
    //     },
    //   ],
    // },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: searchFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: false,
    debugHeaders: false,
    debugColumns: false,
  });

  useEffect(() => {
    setData(allData);
  }, [allData]);

  if (tableDataLoading) return <OtTableLoader />;

  return (
    <div className={classes.OtTableContainer}>
      {/* Global Search */}
      {showGlobalFilter && (
        <Grid container>
          <Grid item xs={12} lg={4}>
            <Input
              className={classes.searchAllColumn}
              value={globalFilter ?? ""}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder="Search all columns..."
              startAdornment={
                <InputAdornment position="start">
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </InputAdornment>
              }
            />
          </Grid>
        </Grid>
      )}
      {/* Table component */}
      <div className={classes.tableContainer}>
        <table className={classes.table}>
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
                          <div
                            className={`${classes.tableColumnHeader} ${
                              header.column.getCanSort()
                                ? classes.cursorPointer
                                : classes.cursorAuto
                            }`}
                          >
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
                                asc: (
                                  <FontAwesomeIcon
                                    size="sm"
                                    icon={faArrowUp}
                                    className={classes.sortIcon}
                                  />
                                ),
                                desc: (
                                  <FontAwesomeIcon
                                    size="sm"
                                    icon={faArrowDown}
                                    className={classes.sortIcon}
                                  />
                                ),
                              }[header.column.getIsSorted() as string] ?? null}
                            </Typography>
                            {header.column.getCanFilter() ? (
                              <OtTableColumnFilter column={header.column} table={table} />
                            ) : null}
                          </div>
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
                          {Boolean(cell.getValue(cell.column)) || naLabel}
                        </Typography>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className={classes.tableControls}>
        <div className="rowsPerPage">
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
          {/* <span className="flex items-center gap-1">
            | Go to page:
            <input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="border p-1 rounded w-16"
            />
          </span> */}
        </div>

        <div className={classes.rowsControls}>
          <div className="pageInfo">
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
              <FontAwesomeIcon size="2xs" icon={faAnglesLeft} />
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
              <FontAwesomeIcon size="2xs" icon={faAnglesRight} />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OtTable;
