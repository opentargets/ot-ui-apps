import { isPrivateEvidenceSection } from "../../utils/partnerPreviewUtils";

const id = "ot_crispr_validation";
export const definition = {
  id,
  name: "Open Targets Validation CRISPR",
  shortName: "VL",
  hasData: ({ otValidationSummary }) => otValidationSummary.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
};
