const id = "overlapping_variants";
export const definition = {
  id,
  name: "Overlapping Variants",
  shortName: "OV",
  hasData: data => data.proteinCodingCoordinates.count > 0,
};
