const id = "variants";
export const definition = {
  id,
  name: "Variants in Credible Set",
  shortName: "VA",
  hasData: data => data?.[0]?.locus?.length > 0,
};