export type DownloadsState = {
  count: number;
  loading: boolean;
  freeTextQuery: string;
  rows: Array<Record<string, unknown>>;
  filteredRows: Array<Record<string, unknown>>;
  schemaRows: Array<Record<string, unknown>>;
  allUniqueCategories: Array<string>;
  selectedFilters: Array<string>;
  downloadsData: Record<string, unknown> | null;
};

/*****************
 * ACTIONS TYPES *
 *****************/

export enum ActionType {
  TEXT_SEARCH = "TEXT_SEARCH",
  SET_LOADING = "SET_LOADING",
  SET_DATA = "SET_DATA",
  SET_CATEGORIES = "SET_CATEGORIES",
  CLEAR_FILTER_DATA = "CLEAR_FILTER_DATA",
  SET_SCHEMA_DATA = "SET_SCHEMA_DATA",
  SET_ACTIVE_FILTER = "SET_ACTIVE_FILTER",
  SET_DOWNLOADS_DATA = "SET_DOWNLOADS_DATA",
}

export type Action =
  | { type: ActionType.SET_DOWNLOADS_DATA; downloadsData: Record<string, unknown> }
  | { type: ActionType.CLEAR_FILTER_DATA }
  | { type: ActionType.SET_SCHEMA_DATA; schemaRows: Array<Record<string, unknown>> }
  | { type: ActionType.SET_ACTIVE_FILTER; selectedFilters: Array<string> }
  | { type: ActionType.SET_CATEGORIES; allUniqueCategories: Array<string> }
  | { type: ActionType.TEXT_SEARCH; freeQueryText: string }
  | { type: ActionType.SET_DATA; rows: Array<Record<string, unknown>> }
  | { type: ActionType.SET_LOADING; loading: boolean };
