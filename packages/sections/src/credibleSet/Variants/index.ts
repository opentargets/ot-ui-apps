const id = "variants";
export const definition = {
  id,
  name: "Variants in Credible Set",
  shortName: "VA",
  hasData: data => data?.locus.count > 0,
};
