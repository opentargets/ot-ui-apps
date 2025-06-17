const id = "molecular_structure";
export const definition = {
  id,
  name: "Molecular Structure",
  shortName: "MS",
  hasData: data => data.proteinCodingCoordinates.count > 0,
};
