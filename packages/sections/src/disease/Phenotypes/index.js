export const definition = {
  id: "phenotypes",
  name: "Clinical signs and symptoms",
  shortName: "CS",
  hasData: data => (data.phenotypes?.count || 0) > 0,
};
