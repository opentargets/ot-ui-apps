import { Action, ActionType } from "../types/downloadTypes";

export function setDownloadsData(downloadsData: Record<string, unknown>): Action {
  return {
    type: ActionType.SET_DOWNLOADS_DATA,
    downloadsData,
  };
}

export function setFilterData(filteredRows: Array<Record<string, unknown>>): Action {
  return {
    type: ActionType.SET_FILTER_DATA,
    filteredRows,
  };
}

export function setSchemaData(schemaRows: Array<Record<string, unknown>>): Action {
  return {
    type: ActionType.SET_SCHEMA_DATA,
    schemaRows,
  };
}

export function setActiveFilter(selectedFilters: Array<string>): Action {
  return {
    type: ActionType.SET_ACTIVE_FILTER,
    selectedFilters,
  };
}

export function setAllUniqueCategories(allUniqueCategories: Array<string>): Action {
  return {
    type: ActionType.SET_CATEGORIES,
    allUniqueCategories,
  };
}

export function textSearch(freeQueryText: string): Action {
  return {
    type: ActionType.TEXT_SEARCH,
    freeQueryText,
  };
}

export function setNewData(rows: Array<Record<string, unknown>>): Action {
  return {
    type: ActionType.SET_DATA,
    rows,
  };
}

export function setLoading(loading: boolean): Action {
  return {
    type: ActionType.SET_LOADING,
    loading,
  };
}
