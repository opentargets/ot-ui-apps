import { DocumentNode } from "graphql";

export enum ENTITIES {
  TARGET = "target",
  DISEASE = "disease",
  DRUG = "drug",
}

/***************
 * STATE TYPES *
 ***************/

export type Pagination = { pageIndex: number; pageSize: number };
export enum TABLE_VIEW {
  MAIN = "MAIN",
  PRIORITISATION = "PRIORITISATION",
}
export type Sorting = { id: string; desc: boolean }[];

export type Data = [any] | []; // TODO: create data type (list of disease || target)

export interface State {
  sorting: Sorting;
  loading: boolean; // TODO: more loaders?
  enableIndirect: boolean;
  query: DocumentNode | null;
  pagination: Pagination;
  parentId: string;
  parentEntity: ENTITIES | null;
  rowEntity: ENTITIES | null;
  tableView: TABLE_VIEW.MAIN | TABLE_VIEW.PRIORITISATION;
  searchFilter: string;
  pinnedEntities: string[];
  advanceOptionsOpen: boolean;
  isMainView: boolean;
  bodyData: Data;
  pinnedData: Data;
}

/*****************
 * ACTIONS TYPES *
 *****************/

export enum ActionType {
  PAGINATE = "PAGINATE",
  SORTING = "SORTING",
  TEXT_SEARCH = "TEXT_SEARCH",
}

export type Action =
  | { type: ActionType.PAGINATE; pagination: Pagination }
  | { type: ActionType.SORTING; sorting: Sorting }
  | { type: ActionType.TEXT_SEARCH; searchFilter: string }
  | { type: ActionType.PAGINATE; pagination: Pagination };
