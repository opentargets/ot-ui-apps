import React from "react";
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
} from "@tanstack/react-table";

import {
  RankingInfo,
  rankItem,
  compareItems,
} from "@tanstack/match-sorter-utils";

import { ALL_DATA } from "./data";
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
} from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  Input,
  InputAdornment,
  makeStyles,
  MenuItem,
  Paper,
  Select,
} from "@material-ui/core";
import OtTableLoader from "./OtTableLoader";

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
        backgroundColor: "lightgrey",
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
    width: "40%",
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
  allColumns,
  allData,
}) {
  if (tableDataLoading) return <OtTableLoader />;

  const classes = useStyles();

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");

  const columns = React.useMemo<ColumnDef<any, any>[]>(
    () => [
      {
        header: "Disease Information",
        columns: [
          {
            header: "Disease Name",
            accessorFn: (row) => row.disease.name,
          },
        ],
      },
      {
        header: "Drug Information",
        columns: [
          {
            header: "Drug Name",
            accessorKey: "drug.name",
            enableColumnFilter: false,
          },
          {
            header: "Drug Type",
            accessorKey: "drugType",
          },
          {
            header: "Mechanism Of Action",
            accessorKey: "mechanismOfAction",
          },
          {
            header: "Action Type",
            id: "actionType",
            accessorFn: (row) => row.drug.mechanismsOfAction.rows[0].actionType,
          },
        ],
      },
      {
        header: "Target Information",
        columns: [
          {
            header: "Approved Symbol",
            accessorKey: "target.approvedSymbol",
          },
        ],
      },
      {
        header: "Clinical Trials Information",
        columns: [
          {
            header: "Phase",
            accessorKey: "phase",
          },
          {
            header: "Status",
            accessorKey: "status",
          },
        ],
      },
    ],
    []
  );

  const [data, setData] = React.useState<any[]>(ALL_DATA.knownDrugs.rows);

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      searchFilterFn: searchFilter,
    },
    state: {
      columnFilters,
      globalFilter,
    },
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

  React.useEffect(() => {
    if (table.getState().columnFilters[0]?.id === "drugType") {
      if (table.getState().sorting[0]?.id !== "drugType") {
        table.setSorting([{ id: "drugType", desc: false }]);
      }
    }
  }, [table.getState().columnFilters[0]?.id]);

  return (
    <div className={classes.OtTableContainer}>
      {/* Global Search */}
      {showGlobalFilter && (
        <div className="globalSearchContainer">
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
        </div>
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
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? "cursor-pointer select-none"
                                : "",
                              onClick: header.column.getToggleSortingHandler(),
                            }}
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
                                <FontAwesomeIcon size="sm" icon={faArrowDown} />
                              ),
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                          {header.column.getCanFilter() ? (
                            <div>
                              {/* <OtTableFilter column={header.column} /> */}
                            </div>
                          ) : null}
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
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
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

export default OtTable;
