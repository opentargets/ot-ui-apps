
const id = "uniprot_variants";
export const definition = {
  id,
  name: "UniProt variants",
  shortName: "UV",
  hasData: ({ evidences }) => evidences.count > 0,
};
