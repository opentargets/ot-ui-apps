import { isPrivateEvidenceSection } from "../../utils/partnerPreviewUtils";

const id = "slapenrich";
export const definition = {
  id,
  name: "SLAPenrich",
  shortName: "SE",
  hasData: data => data.slapEnrich.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
};
