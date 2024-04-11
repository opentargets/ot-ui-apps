import { DocumentNode } from "graphql";
import {
  defaulDatasourcesWeigths,
  getControlChecked,
  getCellId,
  checkBoxPayload,
  DEFAULT_TABLE_PAGINATION_STATE,
  DEFAULT_TABLE_SORTING_STATE,
  DISPLAY_MODE,
} from "../utils";

/***************
 * STATE TYPES *
 ***************/

enum ENTITIES {
  TARGET = "TARGET",
  DISEASE = "DISEASE",
  DRUG = "DRUG",
}

enum TABLE_VIEW {
  MAIN = "MAIN",
  PRIORITISATION = "PRIORITISATION",
}

type Sorting = { id: string; desc: boolean }[];

type Data = [any] | []; // TODO: create data type (list of disease || target)

type Pagination = { pageIndex: number; pageSize: number };

interface State {
  sorting: Sorting;
  loading: boolean; // TODO: more loaders?
  enableIndirect: boolean;
  query: DocumentNode | null;
  pagination: Pagination;
  parentEntity: ENTITIES.DISEASE | ENTITIES.TARGET | null;
  rowEntity: ENTITIES.DISEASE | ENTITIES.TARGET | null;
  tableView: TABLE_VIEW.MAIN | TABLE_VIEW.PRIORITISATION;
  searchFilter: string;
  pinnedEntities: string[];
  advanceOptionsOpen: boolean;
  bodyData: Data;
  pinnedData: Data;
}

/*****************
 * ACTIONS TYPES *
 *****************/

enum ActionType {
  PAGINATE = "PAGINATE",
  SORTING = "SORTING",
  TEXT_SEARCH = "TEXT_SEARCH",
}

type Action =
  | { type: ActionType.PAGINATE; pagination: Pagination }
  | { type: ActionType.SORTING; sorting: Sorting }
  | { type: ActionType.TEXT_SEARCH; searchFilter: string }
  | { type: ActionType.PAGINATE; pagination: Pagination };

/*****************
 * INITIAL STATE *
 *****************/

export const initialState: State = {
  pagination: DEFAULT_TABLE_PAGINATION_STATE,
  loading: false,
  query: null,
  enableIndirect: false,
  sorting: DEFAULT_TABLE_SORTING_STATE,
  parentEntity: null, // TODO: review initial state
  rowEntity: null,
  tableView: TABLE_VIEW.MAIN,
  searchFilter: "",
  advanceOptionsOpen: false,
  pinnedEntities: [],
  bodyData: [],
  pinnedData: [],
};

export function aotfReducer(state: State = initialState, action: Action): State {
  if (typeof state === undefined) {
    throw Error("State provied to aotfReducer is undefined");
  }
  switch (action.type) {
    case ActionType.PAGINATE: {
      return {
        ...state,
        pagination: action.pagination,
      };
    }
    case ActionType.SORTING: {
      return {
        ...state,
        sorting: action.sorting,
      };
    }
    case ActionType.TEXT_SEARCH: {
      return {
        ...state,
        pagination: DEFAULT_TABLE_PAGINATION_STATE,
        searchFilter: action.searchFilter,
      };
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}
