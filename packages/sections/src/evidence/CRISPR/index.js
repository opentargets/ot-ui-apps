import { isPrivateEvidenceSection } from "../../utils/partnerPreviewUtils";

const id = "crispr";
export const definition = {
  id,
  name: "Project Score",
  shortName: "PS",
  hasData: ({ crisprSummary }) => crisprSummary.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
};

export { default as Summary } from "./Summary";
