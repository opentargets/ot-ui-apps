export const definition = {
  id: "GWASStudies",
  name: "GWAS Studies",
  shortName: "GS",
  hasData: data => (
    data?.gwasStudy?.length > 0 ||  // summary
    data?.length > 0                // section - argument is data.gwasStudy
  ),
};
