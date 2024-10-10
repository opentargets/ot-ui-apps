export const definition = {
  id: "GWASStudies",
  name: "GWAS Studies",
  shortName: "GS",
  hasData: data => data?.gwasStudy?.length > 0,
};
