export const initialState = {
  message: null,
  nResidues: null,
  variantResidues: null,
  colorBy: "confidence",
  pathogenicityScores: null,
  variantPathogenicityScore: null,
  showGlobalSurface: true,
};

export function reducer(state, action) {
  switch (action.type) {
    case "setMessage":
      return { ...state, message: action.value };
    case "setNResidues":
      return { ...state, nResidues: action.value };
    case "setVariantResidues":  
      return { ...state, variantResidues: action.value };
    case "setColorBy": 
      return { ...state, colorBy: action.value };
    case "setVariantPathogenicityScore":
      return { ...state, variantPathogenicityScore: action.value };
    case "setPathogenicityScores":
      return { ...state, pathogenicityScores: action.value };
    case "setPathogenicityScores":
      return { ...state, showGlobalSurface: action.value };
    default:
      throw Error(`Invalid action type: ${action.type}`);
  }
}