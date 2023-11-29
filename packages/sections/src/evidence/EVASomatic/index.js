import { isPrivateEvidenceSection } from "../../utils/partnerPreviewUtils";

const id = "eva_somatic";
export const definition = {
  id,
  name: "ClinVar (somatic)",
  shortName: "CS",
  hasData: data => data.eva_somatic.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
};
