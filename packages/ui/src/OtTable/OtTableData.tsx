import React, { useState, useEffect, useMemo } from "react";
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

import { useQuery } from "@apollo/client";
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
// import useTableQueryData from "../hooks/useTableQueryData";

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
        "& p": {
          fontSize: "0.81rem",
          whiteSpace: "nowrap"
        },
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
  showGlobalFilter = true,
  allColumns = [],
  TABLE_DATA_QUERY,
  QUERY_VARIABLES,
  entity,
}) {
  //   const [tableData, tableDataLoading] = useTableQueryData();

  //   if (tableDataLoading) return <OtTableLoader />;

  const classes = useStyles();

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [globalFilter, setGlobalFilter] = useState("");

  const [data, setData] = useState<unknown[]>([]);
  // const [cursor, setCursor] = useState<any>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [loader, setLoader] = useState<any[]>([]);
  let cursor = null;
  const columns = useMemo<ColumnDef<unknown, any>[]>(() => [...allColumns], []);

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const dataQuery = useQuery(TABLE_DATA_QUERY, {
    variables: { ...QUERY_VARIABLES, size: pageSize, cursor: cursor },
    onCompleted: (res) => {
      console.log(data);
      const knownDrugs = res[entity].knownDrugs;
      setPageCount(Math.ceil(knownDrugs.count / pageSize));
      cursor = knownDrugs.cursor;
      console.log(`👻 ~ file: OtTableData.tsx:178 ~ cursor:`, cursor);
      // setCursor(knownDrugs.cursor);
      setData([ ...data, ...knownDrugs.rows]);
    },
  });

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const isValidData = () => {
    return dataQuery.data && dataQuery.data[entity];
  };

  const table = useReactTable({
    data: data,
    pageCount: isValidData() ? pageCount : -1,
    // manualPagination: true,
    columns,
    filterFns: {
      searchFilterFn: searchFilter,
    },
    state: {
      columnFilters,
      globalFilter,
      pagination,
    },
    globalFilterFn: searchFilter,
    onPaginationChange: (e) => {
      console.log(cursor);
      dataQuery.refetch({ ...QUERY_VARIABLES, size: pageSize, cursor: cursor })
      setPagination(e);
    },
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getPaginationRowModel: getPaginationRowModel(), // If only doing manual pagination, you don't need this
    // getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: false,
    debugHeaders: false,
    debugColumns: false,
  });

  // useEffect(() => {
  //   if (dataQuery.data && dataQuery.data[entity]) {
  //     const knownDrugs = dataQuery.data[entity].knownDrugs;
  //     setPageCount(Math.ceil(knownDrugs.count / pageSize));
  //     cursor = knownDrugs.cursor;
  //     console.log(`👻 ~ file: OtTableData.tsx:233 ~ useEffect ~ cursor:`, cursor);
  //     setData([ ...data, ...knownDrugs.rows]);
  //   }
  // }, [dataQuery]);

  useEffect(() => {
    if (table.getState().columnFilters[0]?.id === "actionType") {
      if (table.getState().sorting[0]?.id === "actionType") {
        table.setSorting([{ id: "actionType", desc: true }]);
      }
    }
  }, [table.getState().columnFilters[0]?.id]);

  //   useEffect(() => {
  //     setData(tableData);
  //     setLoader(tableDataLoading);
  //   }, [tableData, tableDataLoading]);

  return (
    <div className={classes.OtTableContainer}>
      {/* Global Search */}
      {showGlobalFilter && (
        <Grid container>
          <Grid item xs={12} lg={4}>
            <Input
              className={classes.searchAllColumn}
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
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
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div className={classes.tableColumnHeader}>
                            <Typography
                              {...{
                                className: header.column.getCanSort()
                                  ? "cursor-pointer select-none"
                                  : "",
                                onClick:
                                  header.column.getToggleSortingHandler(),
                              }}
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
            {table.getRowModel().rows.map((row) => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id}>
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
            <Button
              color="primary"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <FontAwesomeIcon size="lg" icon={faAnglesRight} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OtTableData;
