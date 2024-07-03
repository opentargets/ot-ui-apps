import { isPrivateEvidenceSection } from "../../utils/partnerPreviewUtils";

const id = "ot_crispr";
export const definition = {
  id,
  name: "Open Targets CRISPR",
  shortName: "OT",
  hasData: ({ OtCrisprSummary }) => OtCrisprSummary.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
};
