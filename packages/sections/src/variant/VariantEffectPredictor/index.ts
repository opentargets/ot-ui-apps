const id = "variant_effect_predictor";
export const definition = {
  id,
  name: "Variant Effect Predictor (VEP)",
  shortName: "VE",
  hasData: data => data?.transcriptConsequences?.length > 0,
};
