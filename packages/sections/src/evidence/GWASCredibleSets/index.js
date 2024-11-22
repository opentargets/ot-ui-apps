import { isPrivateEvidenceSection } from "../../utils/partnerPreviewUtils";

const id = "gwas_credible_sets";
export const definition = {
  id,
  name: "GWAS credible sets",
  shortName: "GC",
  hasData: data => data.gwasCredibleSets.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
};
