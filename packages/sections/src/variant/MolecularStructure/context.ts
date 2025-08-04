export const initialState = {
  message: null,
};

export function reducer(state, action) {
  switch (action.type) {
    case "setMessage":
      return { ...state,  message: action.value };
    case "setColor": 
      return { ...state,  color: action.value };
    default:
      throw Error(`Invalid action type: ${action.type}`);
  }
}

export const initialInteractionState = {
  colorBy: "confidence",
  variantPathogenicityScore: null,
  pathogenicityScores: null,
};

// viewer reducer
export function interactionReducer(state, action) {
  switch (action.type) {
    case "setColorBy": 
      return { ...state,  colorBy: action.value };
    case "setVariantPathogenicityScore":
      return { ...state,  variantPathogenicityScore: action.value };
    case "setPathogenicityScores":
      return { ...state,  pathogenicityScores: action.value };
    default:
      throw Error(`Invalid action type: ${action.type}`);
  }
}