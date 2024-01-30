export const definition = {
  id: "safety",
  name: "Safety",
  shortName: "S",
  hasData: data => data.safetyLiabilities.length > 0,
};
