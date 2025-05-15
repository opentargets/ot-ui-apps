const id = "eva";
export const definition = {
  id,
  name: "ClinVar",
  shortName: "CV",
  hasData: data => {
    return (
      data?.evaEvidences?.count > 0 || // summary
      data?.evidences?.count > 0
    ); // section
  },
};
