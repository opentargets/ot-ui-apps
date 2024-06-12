export const definition = {
  id: "pharmacogenetics",
  name: "Pharmacogenetics",
  shortName: "PGx",
  hasData: () => true,   // !! CHANGE WHEN USE GQL !!
  // hasData: data => data.pharmacogenomics.length > 0,
};
