import { DocumentNode } from "graphql";
import {
  defaulDatasourcesWeigths,
  DEFAULT_TABLE_PAGINATION_STATE,
  DEFAULT_TABLE_SORTING_STATE,
} from "../utils";
import { Action, ActionType, ENTITY, State, TABLE_VIEW } from "../types";
import { isEqual } from "lodash";

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
  dataSourceControls: defaulDatasourcesWeigths,
  modifiedSourcesDataControls: false,
  facetFilters: [],
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
    case ActionType.SET_INTERACTORS: {
      const currentInteractors = state.interactors;
      if (typeof currentInteractors === "undefined" || !currentInteractors) return { ...state };
      const payloadInteractor = action.payload;

      // Todo: review
      if (currentInteractors.has(payloadInteractor.id)) {
        const row = currentInteractors.get(payloadInteractor.id);
        row?.push(payloadInteractor.source);
        currentInteractors.set(payloadInteractor.id, row);
      }

      currentInteractors.set(payloadInteractor.id, [payloadInteractor.source]);

      return {
        ...state,
        interactors: currentInteractors,
      };
    }
    case ActionType.DATA_SOURCE_CONTROL: {
      const colUpdatedControls = { ...action.payload };
      const dataSourceControls = state.dataSourceControls.map(col => {
        if (col.id === colUpdatedControls.id) return colUpdatedControls;
        return col;
      });
      const modifiedSourcesDataControls = !isEqual(defaulDatasourcesWeigths, dataSourceControls);
      return {
        ...state,
        dataSourceControls,
        modifiedSourcesDataControls,
        pagination: DEFAULT_TABLE_PAGINATION_STATE,
      };
    }
    case ActionType.RESET_DATA_SOURCE_CONTROL: {
      return {
        ...state,
        dataSourceControls: defaulDatasourcesWeigths,
        modifiedSourcesDataControls: false,
        pagination: DEFAULT_TABLE_PAGINATION_STATE,
      };
    }
    case ActionType.HANDLE_AGGREGATION_CLICK: {
      const aggregation = action.aggregation;

      const isAllActive = state.dataSourceControls
        .filter(el => el.aggregation === aggregation)
        .every(el => el.required === true);
      const dataSourceControls = state.dataSourceControls.map(col => {
        if (col.aggregation === aggregation) {
          return {
            ...col,
            required: !isAllActive,
          };
        }
        return col;
      });
      return {
        ...state,
        dataSourceControls,
        modifiedSourcesDataControls: !isAllActive,
        pagination: DEFAULT_TABLE_PAGINATION_STATE,
      };
    }
    case ActionType.FACETS_SEARCH: {
      return {
        ...state,
        facetFilters: action.facetFilters,
        pagination: DEFAULT_TABLE_PAGINATION_STATE,
      };
    }
    case ActionType.SET_INITIAL_STATE: {
      return {
        ...initialState,
      };
    }
    default: {
      throw Error("Unknown action: " + action);
      return state;
    }
  }
}
