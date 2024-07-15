import { DocumentNode } from "@apollo/client";
import { ColumnDef } from "@tanstack/table-core";

/******************************
 * OT TABLE CLIENT SIDE TYPES *
 ******************************/

export type DefaultSortProp = {
  id: string;
  desc: boolean;
};

export type OtTableProps = {
  showGlobalFilter: boolean;
  tableDataLoading: boolean;
  columns: Array<any>;
  rows: Array<any>;
  verticalHeaders: boolean;
  order: "asc" | "desc";
  sortBy: string;
  defaultSortObj: DefaultSortProp;
  dataDownloader: boolean;
  dataDownloaderColumns?: Array<any>;
  dataDownloaderFileStem: string;
  query: DocumentNode;
  variables: any;
};

/*************************
 * OT TABLE SEARCH TYPES *
 *************************/

export type OtTableSearchProps = {
  setGlobalSearchTerm: React.Dispatch<React.SetStateAction<string>>;
};
