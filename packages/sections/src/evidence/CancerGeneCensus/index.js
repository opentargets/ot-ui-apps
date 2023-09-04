import { isPrivateEvidenceSection } from "../../utils/partnerPreviewUtils";

const id = "cancer_gene_census";
export const definition = {
  id,
  name: "Cancer Gene Census",
  shortName: "CC",
  hasData: ({ cancerGeneCensusSummary }) => cancerGeneCensusSummary.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
};

export { default as Summary } from "./Summary";
