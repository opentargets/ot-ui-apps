import { isPrivateEvidenceSection } from "../../utils/partnerPreviewUtils";

const id = "expression_atlas";
export const definition = {
  id,
  name: "Expression Atlas",
  shortName: "EA",
  hasData: ({ expressionAtlasSummary }) => expressionAtlasSummary.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
};
