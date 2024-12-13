export const definition = {
  id: "GWASStudies",
  name: "GWAS Studies",
  shortName: "GS",
  hasData: data =>
    data?.studies?.count > 0 || // summary
    data?.count > 0, // section
};
