const id = "variants";
export const definition = {
  id,
  name: "Credible Set Variants",
  shortName: "VA",
  hasData: data => data?.[0]?.locus?.length > 0,
};