export const definition = {
  id: "knownDrugs",
  name: "Clinical Precedence",
  shortName: "CP",
  hasData: data => data.knownDrugs?.count > 0 || data.knownDrugs.freeTextQuery || false,
};
