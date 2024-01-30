import { isPrivateEvidenceSection } from "../../utils/partnerPreviewUtils";

const id = "gene2phenotype";
export const definition = {
  id,
  name: "Gene2Phenotype",
  shortName: "GP",
  hasData: data => data.gene2Phenotype.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
};
