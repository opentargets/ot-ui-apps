export enum ActionType {
  SET_VIEWER = "SET_VIEWER",
  SET_DISEASE_THERAPEUTIC = "SET_DISEASE_THERAPEUTIC",
  SET_VARIANT = "SET_VARIANT",
  SET_CONSEQUENCE = "SET_CONSEQUENCE",
  SET_EVIDENCE = "SET_EVIDENCE",
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
  hoveredRow: any;
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
    diseaseTherapeutic: [],
    variant: "",
    consequence: [],
    evidence: [],
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

    case ActionType.SET_DISEASE_THERAPEUTIC:
      return {
        ...state,
        filters: { ...state.filters, diseaseTherapeutic: action.diseaseTherapeutic },
      };

    case ActionType.SET_VARIANT:
      return { ...state, filters: { ...state.filters, variant: action.variant } };

    case ActionType.SET_CONSEQUENCE:
      return {
        ...state,
        filters: { ...state.filters, consequence: action.consequence },
      };

    case ActionType.SET_EVIDENCE:
      return { ...state, filters: { ...state.filters, evidence: action.evidence } };

    case ActionType.SET_START_POSITION:
      return { ...state, filters: { ...state.filters, startPosition: action.startPosition } };

    case ActionType.SET_HOVERED_ROW:
      return { ...state, hoveredRow: state.hoveredRow.concat(action.hoveredRow) };

    case ActionType.SET_UNHOVERED_ROW:
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

  setDiseaseTherapeutic: (diseaseTherapeutic: string[]): Action => ({
    type: ActionType.SET_DISEASE_THERAPEUTIC,
    diseaseTherapeutic,
  }),

  setVariant: (variant: string): Action => ({
    type: ActionType.SET_VARIANT,
    variant,
  }),

  setConsequence: (consequence: string[]): Action => ({
    type: ActionType.SET_CONSEQUENCE,
    consequence,
  }),

  setEvidence: (evidence: string[]): Action => ({
    type: ActionType.SET_EVIDENCE,
    evidence,
  }),

  setStartPosition: (startPosition: number | null): Action => ({
    type: ActionType.SET_START_POSITION,
    startPosition,
  }),

  setHoveredRow: (hoveredRow: any | null): Action => ({
    type: ActionType.SET_HOVERED_ROW,
    hoveredRow,
  }),

  setUnhoveredRow: (): Action => ({
    type: ActionType.SET_UNHOVERED_ROW,
  }),
};
