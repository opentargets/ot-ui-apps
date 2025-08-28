export const initialState = {
  message: "Loading data ...",
  nResidues: null,
  variantResidues: null,
  variantSummary: null,
  representBy: "cartoon",  // "cartoon" | "hybrid" | "trnsparent" | "opaque"
  colorBy: "confidence",   // "confidence" | "pathogenicity" | "domain" | "secondary structure" | "residue type" | "none"
  pathogenicityScores: null,
  variantPathogenicityScore: null,
  domains: null,
};

export function reducer(state, action) {
  switch (action.type) {
    case "setMessage":
      return { ...state, message: action.value };
    case "setNResidues":
      return { ...state, nResidues: action.value };
    case "setVariantResidues":  
      return { ...state, variantResidues: action.value };
    case "setVariantSummary":  
      return { ...state, variantSummary: action.value };
    case "setRepresentBy":
      return { ...state, representBy: action.value };
    case "setColorBy": 
      return { ...state, colorBy: action.value };
    case "setVariantPathogenicityScore":
      return { ...state, variantPathogenicityScore: action.value };
    case "setPathogenicityScores":
      return { ...state, pathogenicityScores: action.value };
    case "setDomains":
      return { ...state, domains: action.value };
    default:
      throw Error(`Invalid action type: ${action.type}`);
  }
}