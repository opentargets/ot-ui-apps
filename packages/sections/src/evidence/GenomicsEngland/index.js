import { isPrivateEvidenceSection } from "../../utils/partnerPreviewUtils";

const id = "genomics_england";
export const definition = {
  id,
  name: "GEL PanelApp",
  shortName: "GE",
  hasData: data => data.genomicsEngland.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
};
