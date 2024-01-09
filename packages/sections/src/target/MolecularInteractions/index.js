export const definition = {
  id: "interactions",
  name: "Molecular Interactions",
  shortName: "MI",
  hasData: data => data.interactions?.count > 0 || false,
};
