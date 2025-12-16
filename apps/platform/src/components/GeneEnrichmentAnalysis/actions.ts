import { type Action, ActionType, type AssociationsState } from "./types";

export function setModalOpen(modalOpen: boolean): Action {
  return {
    type: ActionType.SET_MODAL_OPEN,
    modalOpen,
  };
}

export function resetState(): Action {
  return {
    type: ActionType.RESET_STATE,
  };
}

export function setAssociationsState(associationsState: AssociationsState): Action {
  return {
    type: ActionType.SET_ASSOCIATIONS_STATE,
    associationsState,
  };
}

export function fetchLibrariesRequest(): Action {
  return {
    type: ActionType.FETCH_LIBRARIES_REQUEST,
  };
}

export function fetchLibrariesSuccess(libraries: string[]): Action {
  return {
    type: ActionType.FETCH_LIBRARIES_SUCCESS,
    payload: libraries,
  };
}

export function fetchLibrariesFailure(error: string): Action {
  return {
    type: ActionType.FETCH_LIBRARIES_FAILURE,
    error,
  };
}
