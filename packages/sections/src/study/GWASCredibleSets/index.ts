const id = "gwas_credible_sets";
export const definition = {
  id,
  name: "GWAS Credible Sets",
  shortName: "GW",
  hasData: data => data?.gwasCredibleSets?.count > 0 || data?.credibleSets?.count > 0,
};
