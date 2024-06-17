import { DocumentNode } from "graphql";

export enum ENTITY {
  TARGET = "target",
  DISEASE = "disease",
  DRUG = "drug",
}

export enum TargetPrioritisationAggregation {
  PRECEDENCE = "precedence",
  TRACTABILITY = "tractability",
  DOABILITY = "doability",
  SAFETY = "safety",
}

export type Column = {
  id: string;
  label: string;
  aggregation: TargetPrioritisationAggregation;
  sectionId: string;
  description: string;
  docsLink: string;
  weight?: number | undefined;
  private?: boolean;
};

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

export type RowInteractors = string[];
export type RowInteractorsKey = string;

export type Interactors = Map<RowInteractorsKey, RowInteractors>;

export interface State {
  sorting: Sorting;
  loading: boolean; // TODO: more loaders?
  enableIndirect: boolean;
  query: DocumentNode | null;
  pagination: Pagination;
  parentId: string;
  parentEntity: ENTITY | null;
  rowEntity: ENTITY | null;
  tableView: TABLE_VIEW.MAIN | TABLE_VIEW.PRIORITISATION;
  searchFilter: string;
  pinnedEntities: string[];
  advanceOptionsOpen: boolean;
  isMainView: boolean;
  bodyData: Data;
  pinnedData: Data;
  interactors: Interactors;
}

/*****************
 * ACTIONS TYPES *
 *****************/

export enum ActionType {
  PAGINATE = "PAGINATE",
  SORTING = "SORTING",
  TEXT_SEARCH = "TEXT_SEARCH",
  SET_INTERACTORS = "SET_INTERACTORS",
}

export type SetRowInteractorsPayload = {
  id: RowInteractorsKey;
  source: string;
};

export type Action =
  | { type: ActionType.PAGINATE; pagination: Pagination }
  | { type: ActionType.SORTING; sorting: Sorting }
  | { type: ActionType.TEXT_SEARCH; searchFilter: string }
  | { type: ActionType.PAGINATE; pagination: Pagination }
  | { type: ActionType.SET_INTERACTORS; payload: SetRowInteractorsPayload };
