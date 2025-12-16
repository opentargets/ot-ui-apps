import { type Action, ActionType, type State } from "./types";

/*****************
 * INITIAL STATE *
 *****************/
export const initialState: State = {
  modalOpen: false,
  loading: false,
  associationsState: {
    efoId: "",
    filter: "",
    sortBy: "",
    entitySearch: "",
    enableIndirect: false,
    datasources: [],
    rowsFilter: [],
    facetFilters: [],
    pinnedEntities: [],
    uploadedEntities: [],
  },
};

/*****************
 * REDUCER *
 *****************/
export function geneEnrichmentReducer(state: State = initialState, action: Action): State {
  if (state === undefined || state === null) {
    throw Error("State provided to geneEnrichmentReducer is undefined");
  }

  switch (action.type) {
    case ActionType.SET_MODAL_OPEN: {
      return {
        ...state,
        modalOpen: action.modalOpen,
      };
    }
    case ActionType.RESET_STATE: {
      return {
        ...initialState,
      };
    }
    case ActionType.SET_ASSOCIATIONS_STATE: {
      return {
        ...state,
        associationsState: action.associationsState,
      };
    }
    case ActionType.FETCH_LIBRARIES_REQUEST: {
      return {
        ...state,
        librariesLoading: true,
      };
    }
    case ActionType.FETCH_LIBRARIES_SUCCESS: {
      return {
        ...state,
        libraries: action.payload,
        librariesLoading: false,
      };
    }
    case ActionType.FETCH_LIBRARIES_FAILURE: {
      return {
        ...state,
        librariesError: action.error,
        librariesLoading: false,
      };
    }
    default: {
      return state;
    }
  }
}
