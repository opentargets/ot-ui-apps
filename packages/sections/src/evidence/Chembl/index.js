import { isPrivateEvidenceSection } from "../../utils/partnerPreviewUtils";

const id = "chembl";
export const definition = {
  id,
  name: "ChEMBL",
  shortName: "CE",
  hasData: data => data.chembl.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
};

export { default as Summary } from "./Summary";
