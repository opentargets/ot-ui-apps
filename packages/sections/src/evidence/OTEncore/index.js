import { isPrivateEvidenceSection } from "../../utils/partnerPreviewUtils";

const id = "encore";
export const definition = {
  id,
  name: "Open Targets ENCORE",
  shortName: "OT",
  hasData: ({ otEncoreSummary }) => otEncoreSummary.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
};
