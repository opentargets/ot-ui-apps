const id = "in_silico_predictors";
export const definition = {
  id,
  name: "Variant effect",
  shortName: "VP",
  hasData: data => data?.variantEffect?.length > 0,
};
