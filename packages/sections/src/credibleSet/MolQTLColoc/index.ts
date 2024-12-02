export const definition = {
  id: "gwas_coloc",
  name: "MolQTL Colocalisation",
  shortName: "GC",
  hasData: data => {
    return data?.colocalisation?.length > 0 || data?.molqtlcolocalisation?.length > 0;
  },
};
