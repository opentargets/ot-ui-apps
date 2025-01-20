const id = "locus2gene";
export const definition = {
  id,
  name: "Locus to Gene",
  shortName: "LG",
  hasData: data => data?.l2GPredictions?.count > 0,
};
