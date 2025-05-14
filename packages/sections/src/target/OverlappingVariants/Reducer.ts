// action types
export enum ActionType {
  SET_VIEWER = "SET_VIEWER",
  SET_SEARCH_TEXT = "SET_SEARCH_TEXT",
  SET_THERAPEUTIC_AREAS = "SET_THERAPEUTIC_AREAS",
  SET_VARIANT_TYPES = "SET_VARIANT_TYPES",
  SET_VARIANT_CONSEQUENCES = "SET_VARIANT_CONSEQUENCES",
  SET_EVA = "SET_EVA",
  SET_START_POSITION = "SET_START_POSITION",
  SET_HOVERED_ROW = "SET_HOVERED_ROW",
  SET_UNHOVERED_ROW = "SET_UNHOVERED_ROW",
}

// state types
export interface State {
  viewer: any;
  data: any;
  searchText: string;
  therapeuticAreas: string[]; // ?? SHOULD HAVE A THERAPEUTIC AREAS ENUM ??
  variantTypes: string[]; // SHOULD HAVE AN VARIANT TYPES ENUM ??
  variantConsequences: string[]; // SHOULD HAVE A VARIANT CONSEQUENCES ENUM ??
  eva: string[]; // SHOULD HAVE A EVA ENUM ??
  startPosition: number | null;
  hoveredRow: any;
  unhoveredRow: any;
}
export interface Action {
  type: ActionType;
  [key: string]: any;
}

export const initialState: State = {
  viewer: null,
  data: null,
  searchText: "",
  therapeuticAreas: [],
  variantTypes: [],
  variantConsequences: [],
  eva: [],
  startPosition: null,
  hoveredRow: null,
  unhoveredRow: null,
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
      return { ...state, searchText: action.searchText };

    case ActionType.SET_THERAPEUTIC_AREAS:
      return { ...state, therapeuticAreas: action.therapeuticAreas };

    case ActionType.SET_VARIANT_TYPES:
      return { ...state, variantTypes: action.variantTypes };

    case ActionType.SET_VARIANT_CONSEQUENCES:
      return { ...state, variantConsequences: action.variantConsequences };

    case ActionType.SET_EVA:
      return { ...state, eva: action.eva };

    case ActionType.SET_START_POSITION:
      return { ...state, startPosition: action.startPosition };

    case ActionType.SET_HOVERED_ROW:
      return { ...state, hoveredRow: action.hoveredRow };

    case ActionType.SET_UNHOVERED_ROW:
      return { ...state, unhoveredRow: action.unhoveredRow };

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

  setVariantTypes: (variantTypes: string[]): Action => ({
    type: ActionType.SET_VARIANT_TYPES,
    variantTypes,
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

  setHoveredRow: (hoveredRow: number | null): Action => ({
    type: ActionType.SET_HOVERED_ROW,
    hoveredRow,
  }),

  setUnhoveredRow: (unhoveredRow: number | null): Action => ({
    type: ActionType.SET_UNHOVERED_ROW,
    unhoveredRow,
  }),
};
