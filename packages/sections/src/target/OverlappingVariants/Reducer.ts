export enum ActionType {
  SET_VIEWER = "SET_VIEWER",
  SET_SEARCH_TEXT = "SET_SEARCH_TEXT",
  SET_THERAPEUTIC_AREAS = "SET_THERAPEUTIC_AREAS",
  SET_VARIANT_CONSEQUENCES = "SET_VARIANT_CONSEQUENCES",
  SET_EVA = "SET_EVA",
  SET_START_POSITION = "SET_START_POSITION",
  SET_HOVERED_ROW = "SET_HOVERED_ROW",
  SET_UNHOVERED_ROW = "SET_UNHOVERED_ROW",
}
export interface State {
  viewer: any;
  data: any;
  query: any;
  variables: any;
  filters: any;
  hoveredRow: number[];
}
export interface Action {
  type: ActionType;
  [key: string]: any;
}

export const initialState: State = {
  viewer: null,
  data: null,
  query: null,
  variables: null,
  filters: {
    searchText: "",
    therapeuticAreas: [],
    variantConsequences: [],
    eva: [],
    startPosition: null,
  },
  hoveredRow: [],
};

export const getInitialState = ({ data, query, variables }) => ({
  ...initialState,
  data,
  query,
  variables,
});

// Reducer function
export function reducer(state: State = initialState, action: Action): State {
  if (typeof state === undefined) {
    throw Error("State provided to reducer is undefined");
  }

  switch (action.type) {
    case ActionType.SET_VIEWER:
      return { ...state, viewer: action.viewer };

    case ActionType.SET_SEARCH_TEXT:
      return { ...state, filters: { ...state.filters, searchText: action.searchText } };

    case ActionType.SET_THERAPEUTIC_AREAS:
      return { ...state, filters: { ...state.filters, therapeuticAreas: action.therapeuticAreas } };

    case ActionType.SET_VARIANT_CONSEQUENCES:
      return {
        ...state,
        filters: { ...state.filters, variantConsequences: action.variantConsequences },
      };

    case ActionType.SET_EVA:
      return { ...state, filters: { ...state.filters, eva: action.eva } };

    case ActionType.SET_START_POSITION:
      return { ...state, filters: { ...state.filters, startPosition: action.startPosition } };

    case ActionType.SET_HOVERED_ROW:
      // console.log("SET_HOVERED_ROW", state.hoveredRow.concat(action.hoveredRow));
      return { ...state, hoveredRow: state.hoveredRow.concat(action.hoveredRow) };

    case ActionType.SET_UNHOVERED_ROW:
      // console.log("SET_UNHOVERED_ROW", state.hoveredRow.slice(1));
      return { ...state, hoveredRow: state.hoveredRow.slice(1) };

    default:
      throw Error("Unknown action: " + action.type);
  }
}

// Action creators
export const actions = {
  setViewer: (viewer: any): Action => ({
    type: ActionType.SET_VIEWER,
    viewer,
  }),

  setSearchText: (searchText: string): Action => ({
    type: ActionType.SET_SEARCH_TEXT,
    searchText,
  }),

  setTherapeuticAreas: (therapeuticAreas: string[]): Action => ({
    type: ActionType.SET_THERAPEUTIC_AREAS,
    therapeuticAreas,
  }),

  setVariantConsequences: (variantConsequences: string[]): Action => ({
    type: ActionType.SET_VARIANT_CONSEQUENCES,
    variantConsequences,
  }),

  setEVA: (eva: string[]): Action => ({
    type: ActionType.SET_EVA,
    eva,
  }),

  setStartPosition: (startPosition: number | null): Action => ({
    type: ActionType.SET_START_POSITION,
    startPosition,
  }),

  setHoveredRow: (hoveredRow: any | null): Action => ({
    type: ActionType.SET_HOVERED_ROW,
    hoveredRow,
  }),

  setUnhoveredRow: (unhoveredRow: any | null): Action => ({
    type: ActionType.SET_UNHOVERED_ROW,
  }),
};
