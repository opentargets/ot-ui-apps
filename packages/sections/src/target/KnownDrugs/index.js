export const definition = {
  id: "knownDrugs",
  name: "Known Drugs",
  shortName: "KD",
  hasData: data => data.knownDrugs?.count > 0 || data.knownDrugs.freeTextQuery || false,
};
