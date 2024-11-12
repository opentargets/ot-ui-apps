export const definition = {
  id: "gwas_coloc",
  name: "GWAS/MolQTL Colocalisation",
  shortName: "GC",
  hasData: data => data?.[0]?.qtlCredibleSets?.length > 0 || data?.[0]?.credibleSets?.length > 0,
};
