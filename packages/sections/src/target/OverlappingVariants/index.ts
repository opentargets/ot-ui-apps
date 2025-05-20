const id = "protein_coding_variants";
export const definition = {
  id,
  name: "Protein Coding Variants",
  shortName: "PC",
  hasData: data => data.proteinCodingCoordinates.count > 0,
};
