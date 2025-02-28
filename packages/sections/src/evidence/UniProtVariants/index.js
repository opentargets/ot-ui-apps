import { isPrivateEvidenceSection } from "@ot/constants";

const id = "uniprot_variants";
export const definition = {
  id,
  name: "UniProt variants",
  shortName: "UV",
  hasData: data => data.uniprotVariantsSummary.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
};
