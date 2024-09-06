import { Facet } from "../../Facets/facetsTypes";
import { Action, ActionType, Pagination, RowInteractorsKey } from "../types";

export function onPaginationChange(pagination: Pagination): Action {
  return {
    type: ActionType.PAGINATE,
    pagination: pagination,
  };
}

export function resetPagination(): Action {
  return {
    type: ActionType.RESET_PAGINATION,
  };
}

export function setInteractors(id: RowInteractorsKey, source: string): Action {
  return {
    type: ActionType.SET_INTERACTORS,
    payload: { id, source },
  };
}

export function setDataSourceControl(
  id: string,
  weight: number,
  required: boolean,
  aggregation: string
): Action {
  return {
    type: ActionType.DATA_SOURCE_CONTROL,
    payload: { id, weight, required, propagate: true, aggregation },
  };
}

export function resetDataSourceControl(): Action {
  return {
    type: ActionType.RESET_DATA_SOURCE_CONTROL,
  };
}

export function aggregationClick(aggregation: string): Action {
  return {
    type: ActionType.HANDLE_AGGREGATION_CLICK,
    aggregation,
  };
}

export function facetFilterSelectAction(facets: Facet[]): Action {
  let facetFiltersIds: string[] = [];
  if (facets && facets.length) facetFiltersIds = facets.map(v => v.id);
  return {
    type: ActionType.FACETS_SEARCH,
    facetFilters: facetFiltersIds,
  };
}

export function resetToInitialState(): Action {
  return {
    type: ActionType.SET_INITIAL_STATE,
  };
}
