export const definition = {
  id: "gwas_coloc",
  name: "GWAS/MolQTL Colocalisation",
  shortName: "GC",
  hasData: data => {
    return data?.[0]?.colocalisation?.length > 0;
  },
};
