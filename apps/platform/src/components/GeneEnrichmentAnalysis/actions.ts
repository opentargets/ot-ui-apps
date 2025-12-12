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
