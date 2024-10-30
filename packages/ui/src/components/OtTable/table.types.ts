import { DocumentNode } from "@apollo/client";
import { ColumnDef, Table } from "@tanstack/table-core";

/******************************
 * OT TABLE CLIENT SIDE TYPES *
 ******************************/

export type DefaultSortProp =
  | [
      {
        id: string;
        desc: boolean;
      }
    ]
  | undefined;

export type OtTableProps = {
  showGlobalFilter: boolean;
  tableDataLoading: boolean;
  columns: Array<Record<string, unknown>>;
  rows: Array<Record<string, unknown>>;
  verticalHeaders: boolean;
  order: "asc" | "desc";
  sortBy: string;
  defaultSortObj: DefaultSortProp;
  dataDownloader: boolean;
  dataDownloaderColumns?: Array<Record<string, unknown>>;
  dataDownloaderFileStem: string;
  query: DocumentNode;
  variables: Record<string, unknown>;
  showColumnVisibilityControl: boolean;
  loading: boolean;
};

export type loadingTableRows = {
  id: string;
};

/*************************
 * OT TABLE SEARCH TYPES *
 *************************/

export type OtTableSearchProps = {
  setGlobalSearchTerm: React.Dispatch<React.SetStateAction<string>>;
};

export type OtTableColumnVisibilityProps = {
  table: Table<any>;
};
