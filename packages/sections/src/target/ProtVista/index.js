export const definition = {
  id: "molecularStructure",
  name: "Molecular Structure",
  shortName: "MS",
  hasData: data => {
    return data?.proteinIds?.some?.(e => e.source === "uniprot_swissprot");
  },
};
