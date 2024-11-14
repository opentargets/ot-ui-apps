const id = "locus2gene";
export const definition = {
  id,
  name: "Locus to Gene",
  shortName: "LG",
  hasData: data => data[0]?.l2Gpredictions.length > 0,
};
