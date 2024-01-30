import { isPrivateEvidenceSection } from "../../utils/partnerPreviewUtils";

const id = "intogen";
export const definition = {
  id,
  name: "IntOGen",
  shortName: "IO",
  hasData: data => data.intOgen.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
};
