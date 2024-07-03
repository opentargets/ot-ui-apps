import { isPrivateEvidenceSection } from "../../utils/partnerPreviewUtils";

const id = "ot_genetics_portal";
export const definition = {
  id,
  name: "Open Targets Genetics",
  shortName: "OG",
  hasData: data => data.openTargetsGenetics.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
};
