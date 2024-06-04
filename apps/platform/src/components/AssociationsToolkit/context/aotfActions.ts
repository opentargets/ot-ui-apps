import { Action, ActionType, Interactors, Pagination } from "../types";

export function onPaginationChange(pagination: Pagination): Action {
  return {
    type: ActionType.PAGINATE,
    pagination: pagination,
  };
}

export function setInteractors(interactors: Interactors): Action {
  return {
    type: ActionType.SET_INTERACTORS,
    interactors,
  };
}
