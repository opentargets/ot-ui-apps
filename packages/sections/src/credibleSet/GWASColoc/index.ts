const id = "gwas_coloc";
export const definition = {
  id,
  name: "GWAS Colocalisation",
  shortName: "GC",
  hasData: data => data?.colocalisation?.count > 0,
};
