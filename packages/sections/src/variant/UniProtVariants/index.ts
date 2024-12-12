const id = "uniprot_variants";
export const definition = {
  id,
  name: "UniProt variants",
  shortName: "UV",
  hasData: data => {
    return (
      data?.uniProtEvidences?.count > 0 || // summary
      data?.evidences?.count > 0
    ); // section
  },
};
