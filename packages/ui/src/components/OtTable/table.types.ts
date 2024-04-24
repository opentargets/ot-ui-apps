import { ColumnDef } from "@tanstack/table-core";

/******************************
 * OT TABLE CLIENT SIDE TYPES *
 ******************************/

type DefaultSortProp = {
  id: string;
  desc: boolean;
};

export type OtTableProps = {
  showGlobalFilter: boolean;
  tableDataLoading: boolean;
  columns: Array<any>;
  dataRows: Array<any>;
  verticalHeaders: boolean;
  defaultSortObj: DefaultSortProp;
};

/*************************
 * OT TABLE SEARCH TYPES *
 *************************/

export type OtTableSearchProps = {
  setGlobalSearchTerm: React.Dispatch<React.SetStateAction<string>>;
};
