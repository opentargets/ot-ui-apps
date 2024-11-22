export const definition = {
  id: "gwas_coloc",
  name: "GWAS/MolQTL Colocalisation",
  shortName: "GC",
  hasData: data => {
    return data?.colocalisation?.length > 0;
  },
};
