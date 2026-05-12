import { Facet } from "../Facets/facetsTypes";

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
  sectionProps?: any;
};

/***************
 * STATE TYPES *
 ***************/

export type Pagination = { pageIndex: number; pageSize: number };
export type Sorting = { id: string; desc: boolean }[];

export type columnAdvanceControl = {
  id: string;
  weight: number;
  required: boolean;
  propagate: boolean;
  aggregation: string;
};

export interface QueryState {
  sorting: Sorting;
  enableIndirect: boolean;
  pagination: Pagination;
  dataSourceControls: Array<columnAdvanceControl>;
  modifiedSourcesDataControls: boolean;
  facetFilters: Array<Facet>;
  facetFiltersIds: Array<string>;
  entitySearch: string;
  includeMeasurements: boolean;
}

/*****************
 * ACTIONS TYPES *
 *****************/

export enum ActionType {
  PAGINATE = "PAGINATE",
  SORTING = "SORTING",
  RESET_PAGINATION = "RESET_PAGINATION",
  DATA_SOURCE_CONTROL = "DATA_SOURCE_CONTROL",
  RESET_DATA_SOURCE_CONTROL = "RESET_DATA_SOURCE_CONTROL",
  HANDLE_AGGREGATION_CLICK = "HANDLE_AGGREGATION_CLICK",
  FACETS_SEARCH = "FACETS_SEARCH",
  SET_INITIAL_STATE = "SET_INITIAL_STATE",
  ENTITY_SEARCH = "ENTITY_SEARCH",
  SET_INCLUDE_MEASUREMENTS = "SET_INCLUDE_MEASUREMENTS",
  SET_ENABLE_INDIRECT = "SET_ENABLE_INDIRECT",
}

export type Action =
  | { type: ActionType.PAGINATE; pagination: Pagination }
  | { type: ActionType.SORTING; sorting: Sorting }
  | { type: ActionType.RESET_PAGINATION }
  | { type: ActionType.DATA_SOURCE_CONTROL; payload: columnAdvanceControl }
  | { type: ActionType.RESET_DATA_SOURCE_CONTROL }
  | { type: ActionType.HANDLE_AGGREGATION_CLICK; aggregation: string }
  | { type: ActionType.FACETS_SEARCH; facetFilters: Facet[]; facetFiltersIds: string[] }
  | { type: ActionType.SET_INITIAL_STATE }
  | { type: ActionType.ENTITY_SEARCH; entitySearch: string }
  | { type: ActionType.SET_INCLUDE_MEASUREMENTS; includeMeasurements: boolean }
  | { type: ActionType.SET_ENABLE_INDIRECT; enableIndirect: boolean };
