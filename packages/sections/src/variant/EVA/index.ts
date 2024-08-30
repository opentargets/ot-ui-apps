const id = "eva";
export const definition = {
  id,
  name: "ClinVar",
  shortName: "CV",
  hasData: ({ evidences }) => evidences.count > 0,
};
