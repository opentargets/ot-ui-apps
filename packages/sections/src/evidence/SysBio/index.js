import { isPrivateEvidenceSection } from "@ot/constants";

const id = "sysbio";
export const definition = {
  id,
  name: "Gene signatures",
  shortName: "GS",
  hasData: data => data.sysBio.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
};
