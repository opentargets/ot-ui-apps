const id = "qtl_credible_sets";
export const definition = {
  id,
  name: "molQTL Credible Sets",
  shortName: "QT",
  hasData: data => data?.qtlCredibleSets?.length > 0 ||
                   data?.credibleSets?.length > 0,
};