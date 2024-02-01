import { isPrivateEvidenceSection } from "../../utils/partnerPreviewUtils";

const id = "reactome";
export const definition = {
  id,
  name: "Reactome",
  shortName: "RT",
  hasData: ({ reactomeSummary }) => reactomeSummary.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
};
