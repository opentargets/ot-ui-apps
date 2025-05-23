const id = "protein_structure";
export const definition = {
  id,
  name: "Protein Structure",
  shortName: "PS",
  hasData: data => data.proteinCodingCoordinates.count > 0,
};
