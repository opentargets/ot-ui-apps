const id = "gwas_coloc";
export const definition = {
  id,
  name: "GWAS Colocalisation",
  shortName: "GC",
  hasData: data => data?.[0]?.colocalisation?.length > 0,
};