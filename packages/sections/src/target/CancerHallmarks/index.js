export const definition = {
  id: "cancerHallmarks",
  name: "Cancer Hallmarks",
  shortName: "CH",
  hasData: data => data.hallmarks?.cancerHallmarks?.length > 0,
};
