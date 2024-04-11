import { useState, useEffect, useMemo } from "react";
import {
  Grid,
  Input,
  InputAdornment,
  Typography,
  CircularProgress,
  NativeSelect,
  IconButton,
} from "@mui/material";
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
  flexRender,
  PaginationState,
} from "@tanstack/react-table";
import {
  faAngleRight,
  faAnglesLeft,
  faMagnifyingGlass,
  faArrowUp,
  faArrowDown,
  faAngleLeft,
} from "@fortawesome/free-solid-svg-icons";

import { makeStyles } from "@mui/styles";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import OtTableLoader from "./OtTableLoader";
import useDebounce from "../../hooks/useDebounce";
import OtTableColumnFilter from "./OtTableColumnFilter";

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

function OtTableSSP({
  showGlobalFilter = false,
  tableDataLoading = false,
  allColumns = [],
  allData = [],
  count = 0,
  getMoreData = ({ searchQuery = "", pageSize = 10 }) => null,
  verticalHeaders = false,
}) {
  const classes = useStyles();

  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const debouncedTableSearchValue = useDebounce(globalFilter, 300);
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  function getPageCount() {
    return Math.ceil(count / pageSize) || -1;
  }

  function onPaginationChange(updater) {
    const newState = updater(pagination);
    const newIndex = newState.pageIndex;
    const newPageSize = newState.pageSize;
    const dataLength = table.options.data.length;

    const isPageSizeIncrease = newPageSize > pageSize;
    const nextPageRequested = newIndex > pageIndex;
    const requiresMoreData = dataLength <= newIndex * newPageSize;

    if (isPageSizeIncrease) getMoreData({ pageSize: newPageSize });
    else if (nextPageRequested && requiresMoreData) {
      console.log("fetch");
      getMoreData({});
    } else {
      console.log("dont fetch");
    }
    setPagination(newState);
  }

  const table = useReactTable({
    data: allData,
    columns: allColumns,
    pageCount: getPageCount(),
    globalFilterFn: searchFilter,
    filterFns: {
      searchFilterFn: searchFilter,
    },
    state: {
      columnFilters,
      globalFilter: debouncedTableSearchValue,
      pagination,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    // manualPagination: true,
  });

  // useEffect(() => {
  //   const WHOLE_DATA = [...data, ...allData];
  //   console.log("useEffect -> WHOLE_DATA", WHOLE_DATA);
  //   setData(WHOLE_DATA);
  //   table.setPageIndex(pageIndex);
  //   console.log(data);
  // }, [allData]);

  useEffect(() => {
    getMoreData({ searchQuery: debouncedTableSearchValue });
  }, [debouncedTableSearchValue]);

  // useEffect(() => {
  //   if (allData.length > 0) {
  //     console.log(pagination);
  //     setPagination(pagination);
  //   }
  // }, [allData]);

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
                      className={header.column.columnDef.sticky ? classes.stickyColumn : ""}
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
                              <OtTableColumnFilter column={header.column} />
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
            disabled={tableDataLoading}
            disableUnderline
            sx={{ pl: theme => theme.spacing(2) }}
            value={table.getState().pagination.pageSize}
            onChange={e => {
              console.log(Number(e.target.value));
              table.setPageSize(Number(e.target.value));
              setPagination({
                pageIndex: 0,
                pageSize: Number(e.target.value),
              });
            }}
          >
            {[10, 25, 100].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </NativeSelect>
        </div>

        <div className={classes.rowsControls}>
          {tableDataLoading && <CircularProgress size={20} />}
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
              onClick={() => {
                table.setPageIndex(0);
              }}
              disabled={tableDataLoading || !table.getCanPreviousPage()}
            >
              <FontAwesomeIcon size="2xs" icon={faAnglesLeft} />
            </IconButton>
            <IconButton
              color="primary"
              onClick={() => table.previousPage()}
              disabled={tableDataLoading || !table.getCanPreviousPage()}
            >
              <FontAwesomeIcon size="2xs" icon={faAngleLeft} />
            </IconButton>

            <IconButton
              color="primary"
              onClick={() => {
                table.nextPage();
              }}
              disabled={tableDataLoading || !table.getCanNextPage()}
            >
              <FontAwesomeIcon size="2xs" icon={faAngleRight} />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OtTableSSP;
