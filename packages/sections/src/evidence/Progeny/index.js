import { isPrivateEvidenceSection } from "../../utils/partnerPreviewUtils";

const id = "progeny";
export const definition = {
  id,
  name: "PROGENy",
  shortName: "PY",
  hasData: data => data.progeny.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
};
