export const definition = {
  id: "indications",
  name: "Indications",
  shortName: "I",
  hasData: data => data.indications?.count > 0 || false,
};
