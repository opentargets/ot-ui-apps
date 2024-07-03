export const definition = {
  id: "expressions",
  name: "Baseline Expression",
  shortName: "BE",
  hasData: data => {
    const hasRNA = data.expressions.some(d => d.rna?.level >= 0);
    const hasProtein = data.expressions.some(d => d.protein?.level >= 0);
    // TODO:
    // the check for gtex data should be remove if/when
    // we stop checking for data on switching tab (see comment in GtexTab)
    const hasGtex = data.expressions.some(d => d.tissueSiteDetailId);
    return hasRNA || hasProtein || hasGtex;
  },
};
