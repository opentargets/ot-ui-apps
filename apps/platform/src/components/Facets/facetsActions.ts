import {
  Action,
  ActionType,
  DISEASE_CATEGORIES,
  ENTITY,
  Facet,
  TARGET_CATEGORIES,
} from "./facets.types";

export function setFacetsData(payload: Facet[]): Action {
  return {
    type: ActionType.SEARCH_FACETS,
    payload,
  };
}

export function setFacetsCategories(entity: ENTITY): Action {
  const CATEGORIES = entity === ENTITY.DISEASE ? DISEASE_CATEGORIES : TARGET_CATEGORIES;
  return {
    type: ActionType.SEARCH_CATEGORY,
    categories: CATEGORIES,
  };
}

export function resetFacets(entityToGet: ENTITY): Action {
  return {
    type: ActionType.RESET_FACETS,
    entityToGet,
  };
}

export function setLoading(loading: boolean): Action {
  return {
    type: ActionType.SET_LOADING,
    loading,
  };
}

export function setCategory(category: string): Action {
  return {
    type: ActionType.SET_CATEGORY,
    category,
  };
}

export function selectFacet(facets: Facet[]): Action {
  return {
    type: ActionType.SELECT_FACET,
    payload: facets,
  };
}
