import { isPrivateEvidenceSection } from "../../utils/partnerPreviewUtils";

const id = "crispr_screen";
export const definition = {
  id,
  name: "CRISPR Screens",
  shortName: "CS",
  hasData: ({ CrisprScreenSummary }) => CrisprScreenSummary.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
};
