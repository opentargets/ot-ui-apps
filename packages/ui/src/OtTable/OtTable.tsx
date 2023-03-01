import React from "react";
import {
  Column,
  Table,
  useReactTable,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  sortingFns,
  getSortedRowModel,
  FilterFn,
  SortingFn,
  ColumnDef,
  flexRender,
  FilterFns,
} from "@tanstack/react-table";

import {
  RankingInfo,
  rankItem,
  compareItems,
} from "@tanstack/match-sorter-utils";

import { ALL_DATA } from "./data";

function OtTable() {
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
            accessorKey: "disease.name",
            cell: (info) => info.getValue(),
          },
        ],
      },
      {
        header: "Drug Information",
        columns: [
          {
            accessorKey: "drug.name",
            cell: (info) => info.getValue(),
          },
          {
            accessorKey: "drugType",
            cell: (info) => info.getValue(),
          },
          {
            accessorKey: "mechanismsOfAction",
            cell: (info) => info.getValue(),
          },
          {
            accessorKey: "actionType",
            cell: (info) => info.getValue(),
          },
        ],
      },
      {
        header: "Target Information",
        columns: [
          {
            accessorKey: "target.approvedSymbol",
            cell: (info) => info.getValue(),
          },
        ],
      },
      {
        header: "Clinical trials information",
        columns: [
          {
            accessorKey: "phase",
            cell: (info) => info.getValue(),
          },
          {
            accessorKey: "status",
            cell: (info) => info.getValue(),
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
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: true,
    debugHeaders: true,
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
    <>
      {/* Global Search */}
      <div className="globalSearchContainer">
        <input
          value={globalFilter ?? ""}
          onChange={(value) => setGlobalFilter(String(value))}
          placeholder="Search all columns..."
        />
      </div>
      {/* Table component */}
      <div className="tableContainer">
        <table>
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
                              asc: " 🔼",
                              desc: " 🔽",
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                          {/* {header.column.getCanFilter() ? (
                            <div>
                              <Filter column={header.column} table={table} />
                            </div>
                          ) : null} */}
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
      OT table
    </>
  );
}

export default OtTable;
