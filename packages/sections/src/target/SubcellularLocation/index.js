export const definition = {
  id: "subcellularLocation",
  name: "Subcellular Location",
  shortName: "SL",
  hasData: ({ subcellularLocations }) => subcellularLocations.length > 0,
};
