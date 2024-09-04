const id = "qtl_credible_sets";
export const definition = {
  id,
  name: "molQTL Credible Sets",
  shortName: "QT",
  hasData: data => data?.credibleSets?.length > 0,
};