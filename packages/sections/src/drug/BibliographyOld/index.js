export const definition = {
  id: "bibliography",
  name: "Bibliography",
  shortName: "B",
  hasData: data => data.literatureOcurrences?.filteredCount > 0,
};
