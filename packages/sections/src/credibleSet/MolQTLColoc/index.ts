export const definition = {
  id: "gwas_coloc",
  name: "MolQTL Colocalisation",
  shortName: "GC",
  hasData: data => {
    return data?.colocalisation?.count > 0 || data?.molqtlcolocalisation?.count > 0;
  },
};
