import { isPrivateEvidenceSection } from "@ot/constants";

const id = "eva";
export const definition = {
  id,
  name: "ClinVar",
  shortName: "CV",
  hasData: ({ eva }) => eva.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
};
