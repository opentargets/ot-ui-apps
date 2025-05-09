import { Action, ActionType, DownloadsState } from "../types/downloadTypes";
import {
  addCategoriesToData,
  filterDownloadCardsForFilter,
  filterDownloadCardsForTextSearch,
  getAllRows,
  getSchemaRows,
} from "../utils";

export const initialState: DownloadsState = {
  count: 0,
  loading: true,
  freeTextQuery: "",
  rows: [],
  filteredRows: [],
  schemaRows: [],
  allUniqueCategories: [],
  selectedFilters: [],
  downloadsData: null,
};

export function createInitialState(str: string): DownloadsState {
  return initialState;
}

export function downloadsReducer(
  state: DownloadsState = initialState,
  action: Action
): DownloadsState {
  if (typeof state === undefined) {
    throw Error("State provided to table reducer is undefined");
  }
  switch (action.type) {
    case ActionType.SET_LOADING: {
      return {
        ...state,
        loading: action.loading,
      };
    }
    case ActionType.TEXT_SEARCH: {
      const preFilteredRows = state.selectedFilters.length
        ? filterDownloadCardsForFilter(state.selectedFilters, state.rows)
        : state.rows;
      const filteredRows =
        filterDownloadCardsForTextSearch(action.freeQueryText, preFilteredRows) || preFilteredRows;
      return {
        ...state,
        freeTextQuery: action.freeQueryText,
        filteredRows: filteredRows,
        count: filteredRows.length,
      };
    }
    case ActionType.SET_DATA: {
      return {
        ...state,
        loading: false,
        rows: action.rows,
        count: action.rows.length,
      };
    }
    case ActionType.CLEAR_FILTER_DATA: {
      return {
        ...state,
        filteredRows: state.rows,
        count: state.rows.length,
        selectedFilters: [],
        freeTextQuery: "",
      };
    }
    case ActionType.SET_SCHEMA_DATA: {
      return {
        ...state,
        schemaRows: action.schemaRows,
      };
    }
    case ActionType.SET_ACTIVE_FILTER: {
      const preFilteredRows = state.freeTextQuery ? state.filteredRows : state.rows;
      const filteredRows = action.selectedFilters.length
        ? filterDownloadCardsForFilter(action.selectedFilters, preFilteredRows)
        : preFilteredRows;
      return {
        ...state,
        selectedFilters: action.selectedFilters,
        filteredRows,
        count: filteredRows.length,
      };
    }
    case ActionType.SET_CATEGORIES: {
      return {
        ...state,
        allUniqueCategories: action.allUniqueCategories,
      };
    }
    case ActionType.SET_DOWNLOADS_DATA: {
      const ALL_ROWS = [...getAllRows(action.downloadsData)];
      const { allDisplayRows, allUniqueCategories } = addCategoriesToData(ALL_ROWS);
      return {
        ...state,
        loading: false,
        downloadsData: action.downloadsData,
        rows: allDisplayRows,
        filteredRows: allDisplayRows,
        count: allDisplayRows.length,
        schemaRows: getSchemaRows(action.downloadsData),
        allUniqueCategories,
      };
    }

    default: {
      throw Error("Unknown action: " + action);
      return state;
    }
  }
}
