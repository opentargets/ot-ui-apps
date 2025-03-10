export const definition = {
  id: "molecularStructure",
  name: "Molecular Structure",
  shortName: "MS",
  hasData: ({ proteinIds }) => proteinIds.some(e => e.source === "uniprot_swissprot"),
};
