import { isPrivateEvidenceSection } from "../../utils/partnerPreviewUtils";

const id = "orphanet";
export const definition = {
  id,
  name: "Orphanet",
  shortName: "ON",
  hasData: data => data.orphanetSummary.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
};
