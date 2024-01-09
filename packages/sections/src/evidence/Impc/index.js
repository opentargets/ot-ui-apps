import { isPrivateEvidenceSection } from "../../utils/partnerPreviewUtils";

const id = "impc";
export const definition = {
  id,
  name: "IMPC",
  shortName: "IM",
  hasData: data => data.impc.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
};
