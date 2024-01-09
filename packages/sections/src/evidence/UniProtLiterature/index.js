import { isPrivateEvidenceSection } from "../../utils/partnerPreviewUtils";

const id = "uniprot_literature";
export const definition = {
  id,
  name: "UniProt literature",
  shortName: "UL",
  hasData: ({ uniprotLiteratureSummary }) => uniprotLiteratureSummary.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
};
