const id = "gwas_credible_sets";
export const definition = {
  id,
  name: "GWAS Credible Sets",
  shortName: "GW",
  hasData: data => data?.gwasCredibleSets?.length > 0 ||
                   data?.credibleSets?.length > 0,
};
