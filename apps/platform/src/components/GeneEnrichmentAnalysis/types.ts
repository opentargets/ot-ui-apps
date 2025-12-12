/*****************
 * ACTIONS TYPES *
 *****************/
export enum ActionType {
  SET_MODAL_OPEN = "SET_MODAL_OPEN",
  RESET_STATE = "RESET_STATE",
  SET_ASSOCIATIONS_STATE = "SET_ASSOCIATIONS_STATE",
}

/***************
 * STATE TYPES *
 ***************/
export interface AssociationsState {
  efoId: string;
  filter: string;
  sortBy: string;
  enableIndirect: boolean;
  datasources: Array<{ id: string; weight: number; propagate: boolean; required: boolean }>;
  rowsFilter: string[];
  facetFilters: string[];
  entitySearch: string;
  pinnedEntities: string[];
  uploadedEntities: string[];
}

export interface State {
  modalOpen: boolean;
  loading: boolean;
  associationsState: AssociationsState;
}

/*****************
 * ACTION TYPES *
 *****************/
export type Action =
  | { type: ActionType.SET_MODAL_OPEN; modalOpen: boolean }
  | { type: ActionType.RESET_STATE }
  | { type: ActionType.SET_ASSOCIATIONS_STATE; associationsState: AssociationsState };
