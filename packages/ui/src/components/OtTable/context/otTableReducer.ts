import { Action, ActionType, INIT_PAGE_SIZE, OtTableSSPState } from "../types/tableTypes";

export const initialState: OtTableSSPState = {
  count: 0,
  loading: true,
  rows: [],
  cursor: null,
  freeTextQuery: "",
};

export function createInitialState(str: string): OtTableSSPState {
  return initialState;
}

export function otTableReducer(
  state: OtTableSSPState = initialState,
  action: Action
): OtTableSSPState {
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
    case ActionType.PAGE_SIZE_CHANGE: {
      return {
        ...state,
        /**
         *
         */
      };
    }
    case ActionType.SET_DATA: {
      return {
        ...state,
        loading: false,
        count: action.payload.count,
        cursor: action.payload.cursor,
        rows: [...state.rows, ...action.payload.rows],
      };
    }
    default: {
      throw Error("Unknown action: " + action);
      return state;
    }
  }
}
