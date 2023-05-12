import { useState, useEffect, useMemo } from "react";
import {
  Column,
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
  PaginationState,
} from "@tanstack/react-table";

import {
  RankingInfo,
  rankItem,
  compareItems,
} from "@tanstack/match-sorter-utils";

import OtTableFilter from "./OtTableFilter";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDownZA,
  faArrowUpAZ,
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
  faMagnifyingGlass,
  faArrowUp,
  faArrowDown,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  Grid,
  Input,
  InputAdornment,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@material-ui/core";
import OtTableLoader from "./OtTableLoader";
import OtTableRowsLoader from "./OtTableRowsLoader";
import useDebounce from "../hooks/useDebounce";

const useStyles = makeStyles((theme) => ({
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
            borderRight: "1px solid lightgrey",
          },
        },
      },
    },
    "& tr": {
      // update broder color
      borderBottom: "1px solid lightgrey",
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

function OtTableData({
  showGlobalFilter = false,
  tableDataLoading = false,
  initialLoad = false,
  allColumns = [],
  allData = [],
  count = -1,
  getMoreData = (searchQuery?) => ({}),
  verticalHeaders = false,
}) {
  const classes = useStyles();

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [data, setData] = useState<any[]>([...allData]);
  const debouncedInputValue = useDebounce(globalFilter, 300);
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const onPaginationChange = (e) => {
    setPagination(e);
    if (table.options.data.length / pageSize - 2 === pagination.pageIndex)
      getMoreData();
  };

  const getPageCount = () => {
    return Math.ceil(count / pageSize) || -1;
  };

  const onGlobalFilterSearch = (e) => {
    setGlobalFilter(e.target.value);
  };

  const columns = useMemo<ColumnDef<any, any>[]>(() => [...allColumns], []);
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );
  useEffect(() => {
    setData(allData);
  }, [allData]);

  useEffect(() => {
    table.setPageIndex(pageIndex);
  }, [data]);

  useEffect(() => {
    getMoreData(debouncedInputValue);
  }, [debouncedInputValue]);

  const table = useReactTable({
    data,
    pageCount: getPageCount(),
    columns,
    filterFns: {
      searchFilterFn: searchFilter,
    },
    state: {
      columnFilters,
      globalFilter,
      pagination,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: onPaginationChange,
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

  if (initialLoad) return <OtTableLoader />;

  return (
    <div className={classes.OtTableContainer}>
      {/* Global Search */}
      {showGlobalFilter && (
        <Grid container>
          <Grid item xs={12} lg={4}>
            <Input
              className={classes.searchAllColumn}
              value={globalFilter ?? ""}
              onChange={onGlobalFilterSearch}
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
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className={
                        header.column.columnDef.sticky
                          ? classes.stickyColumn
                          : ""
                      }
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
                                (verticalHeaders || header.column.columnDef.verticalHeader) ? classes.verticalHeaders : ""
                              }`}
                              onClick={header.column.getToggleSortingHandler()}
                              variant="subtitle2"
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {{
                                asc: (
                                  <FontAwesomeIcon size="sm" icon={faArrowUp} />
                                ),
                                desc: (
                                  <FontAwesomeIcon
                                    size="sm"
                                    icon={faArrowDown}
                                  />
                                ),
                              }[header.column.getIsSorted() as string] ?? null}
                            </Typography>
                            {header.column.getCanFilter() ? (
                              <OtTableFilter
                                column={header.column}
                                table={table}
                              />
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
            {!tableDataLoading &&
              table.getRowModel().rows.map((row) => {
                return (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td
                          key={cell.id}
                          className={
                            cell.column.columnDef.sticky
                              ? classes.stickyColumn
                              : ""
                          }
                        >
                          <Typography variant="body2">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </Typography>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
          </tbody>
        </table>
        {tableDataLoading && <OtTableRowsLoader />}
      </div>
      <div className={classes.tableControls}>
        <div className="rowsPerPage">
          <span>Rows per page: {"    "}</span>
          <Select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 25, 100].map((pageSize) => (
              <MenuItem key={pageSize} value={pageSize}>
                {pageSize}
              </MenuItem>
            ))}
          </Select>
        </div>

        <div className={classes.rowsControls}>
          <div className="pageInfo">
            <span>Page </span>
            <span>
              <strong>
                {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </strong>
            </span>
          </div>

          <div className="paginationAction">
            <Button
              color="primary"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <FontAwesomeIcon size="lg" icon={faAnglesLeft} />
            </Button>
            <Button
              color="primary"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <FontAwesomeIcon size="lg" icon={faAngleLeft} />
            </Button>

            <Button
              color="primary"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <FontAwesomeIcon size="lg" icon={faAngleRight} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OtTableData;
