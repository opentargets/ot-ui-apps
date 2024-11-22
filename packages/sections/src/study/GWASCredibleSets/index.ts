const id = "gwas_credible_sets";
export const definition = {
  id,
  name: "GWAS Credible Sets",
  shortName: "GW",
  hasData: data => data?.[0]?.gwasCredibleSets?.count > 0 ||
    data?.[0]?.credibleSets?.count > 0,
};