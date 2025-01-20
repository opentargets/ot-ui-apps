export const definition = {
  id: "molqtl_coloc",
  name: "MolQTL Colocalisation",
  shortName: "QC",
  hasData: data => {
    return data?.colocalisation?.count > 0 || data?.molqtlcolocalisation?.count > 0;
  },
};
