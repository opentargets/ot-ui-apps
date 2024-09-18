const id = "qtl_credible_sets";
export const definition = {
  id,
  name: "molQTL Credible Sets",
  shortName: "QT",
  hasData: data => data?.[0]?.qtlCredibleSets?.length > 0 ||
                   data?.[0]?.credibleSets?.length > 0,
};