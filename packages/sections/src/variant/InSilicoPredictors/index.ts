const id = "in_silico_predictors";
export const definition = {
  id,
  name: "In silico predictors",
  shortName: "VP",
  hasData: data => data?.inSilicoPredictors?.length > 0,
};
