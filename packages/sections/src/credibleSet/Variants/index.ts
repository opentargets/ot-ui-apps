const id = "variants";
export const definition = {
  id,
  name: "Credible Set Variants",
  shortName: "VA",
  hasData: data => data?.locus.count > 0 || data?.locusSize.count > 0,
};
