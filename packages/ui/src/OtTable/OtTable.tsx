import { useEffect, useMemo, useState } from "react";
import OtTableGlobalFilter from "./OtTableGlobalFilter";
import OtTableBody from "./OtTableBody";
import OtTableFooter from "./OtTableFooter";
import useDebounce from "../hooks/useDebounce";
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
  PaginationState,
} from "@tanstack/react-table";
import {
  RankingInfo,
  rankItem,
  compareItems,
} from "@tanstack/match-sorter-utils";

type OtTableProp = {
  showGlobalFilter: boolean;
  tableDataLoading: boolean;
  initialLoad: boolean;
  columns: Array<any>;
  data: Array<object>;
  verticalHeaders: boolean;
  count: number;
  getMoreData: (searchQuery?) => void;
  initPageSize: number;
  showLastPageControl: boolean;
};

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
  initialLoad = false,
  columns = [],
  data = [],
  verticalHeaders = false,
  count = -1,
  getMoreData = (searchQuery?) => ({}),
  initPageSize = 10,
  showLastPageControl = true,
}: OtTableProp) {
  const [tableRows, setTableRows] = useState<any[]>([...data]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initPageSize,
  });

  const debouncedInputValue = useDebounce(globalFilter, 300);

  const tableColumns = useMemo<ColumnDef<any, any>[]>(() => [...columns], []);
//   const tableColumns = useMemo<ColumnDef<any, any>[]>(() => [...columns];
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  useEffect(() => {
    setTableRows(data);
  }, [data]);
  useEffect(() => {
    table.setPageIndex(pageIndex);
  }, [tableRows]);
  useEffect(() => {
    getMoreData(debouncedInputValue);
  }, [debouncedInputValue]);

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

  const table = useReactTable({
    data,
    pageCount: getPageCount(),
    columns: tableColumns,
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

  return (
    <>
      {/* Global Search */}
      {showGlobalFilter && (
        <OtTableGlobalFilter
          globalFilter={globalFilter}
          onGlobalFilterSearch={onGlobalFilterSearch}
        />
      )}
      <OtTableBody
        table={table}
        initialLoad={initialLoad}
        tableDataLoading={tableDataLoading}
        verticalHeaders={verticalHeaders}
      />
      <OtTableFooter
        table={table}
        initialLoad={initialLoad}
        showLastPageControl={showLastPageControl}
      />
    </>
  );
}

export default OtTable;
