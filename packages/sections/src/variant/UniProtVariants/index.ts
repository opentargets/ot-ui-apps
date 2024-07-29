// import { isPrivateEvidenceSection } from "../../utils/partnerPreviewUtils";

const id = "uniprot_variants";
export const definition = {
  id,
  name: "UniProt variants",
  shortName: "UV",
  // !! UPDATE HERE ONCE HAVE PROPER DATA
  hasData: data => true,  // data.uniprotVariantsSummary.count > 0,
  isPrivate: false,  // isPrivateEvidenceSection(id),
};
