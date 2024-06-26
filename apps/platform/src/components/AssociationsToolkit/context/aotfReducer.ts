import { DocumentNode } from "graphql";
import { DEFAULT_TABLE_PAGINATION_STATE, DEFAULT_TABLE_SORTING_STATE } from "../utils";
import { Action, ActionType, ENTITY, State, TABLE_VIEW } from "../types";

/*****************
 * INITIAL STATE *
 *****************/

export const initialState: State = {
  pagination: DEFAULT_TABLE_PAGINATION_STATE,
  loading: false,
  query: null,
  parentId: "",
  enableIndirect: false,
  sorting: DEFAULT_TABLE_SORTING_STATE,
  parentEntity: null, // TODO: review initial state
  rowEntity: null,
  tableView: TABLE_VIEW.MAIN,
  isMainView: true,
  searchFilter: "",
  advanceOptionsOpen: false,
  pinnedEntities: [],
  bodyData: [],
  pinnedData: [],
  interactors: new Map(),
};

type InitialStateParams = {
  parentEntity: ENTITY;
  parentId: string;
  query: DocumentNode;
};

export function createInitialState({ parentEntity, parentId, query }: InitialStateParams): State {
  const rowEntity = parentEntity === ENTITY.TARGET ? ENTITY.DISEASE : ENTITY.TARGET;
  const state = { ...initialState, query, parentId, parentEntity, rowEntity };
  return state;
}

export function aotfReducer(state: State = initialState, action: Action): State {
  if (typeof state === undefined) {
    throw Error("State provied to aotfReducer is undefined");
  }
  switch (action.type) {
    case ActionType.PAGINATE: {
      return {
        ...state,
        pagination: action.pagination,
      };
    }
    case ActionType.RESET_PAGINATION: {
      return {
        ...state,
        pagination: DEFAULT_TABLE_PAGINATION_STATE,
      };
    }
    case ActionType.SORTING: {
      return {
        ...state,
        sorting: action.sorting,
      };
    }
    case ActionType.TEXT_SEARCH: {
      return {
        ...state,
        pagination: DEFAULT_TABLE_PAGINATION_STATE,
        searchFilter: action.searchFilter,
      };
    }
    case ActionType.SET_INTERACTORS: {
      const interactorsState = state.interactors;
      if (typeof interactorsState === "undefined" || !interactorsState) return { ...state };
      const { payload } = action;

      interactorsState.set(payload.id, [payload.source]);

      return {
        ...state,
        interactors: interactorsState,
      };
    }
    case ActionType.DISABLE_INTERACTORS: {
      const interactorsState = state.interactors;
      if (typeof interactorsState === "undefined" || !interactorsState) return { ...state };
      const { payload } = action;

      interactorsState.delete(payload.id);

      return { ...state, interactors: interactorsState };
    }
    default: {
      throw Error("Unknown action: " + action);
      return state;
    }
  }
}
