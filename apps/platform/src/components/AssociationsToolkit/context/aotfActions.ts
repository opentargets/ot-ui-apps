import { Action, ActionType, Pagination } from "./types";

export function onPaginationChange(newPagination: Pagination): Action {
  return {
    type: ActionType.PAGINATE,
    pagination: newPagination,
  };
}
