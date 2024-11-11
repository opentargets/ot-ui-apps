const id = "variant_effect_predictor";
export const definition = {
  id,
  name: "Transcript consequences",
  shortName: "TC",
  hasData: data => data?.transcriptConsequences?.length > 0,
};
