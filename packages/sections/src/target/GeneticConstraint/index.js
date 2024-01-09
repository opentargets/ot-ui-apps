export const definition = {
  id: "geneticConstraint",
  name: "Genetic Constraint",
  shortName: "GC",
  hasData: ({ geneticConstraint }) => geneticConstraint.length > 0,
};
