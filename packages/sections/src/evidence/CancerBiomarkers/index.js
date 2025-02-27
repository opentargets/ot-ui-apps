import { dataTypesMap } from "@ot/constants";
import { isPrivateEvidenceSection } from "@ot/constants";

const id = "cancer_biomarkers";
export const definition = {
  id,
  name: "Cancer Biomarkers",
  shortName: "CB",
  hasData: data => data.cancerBiomarkersSummary.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
  dataType: dataTypesMap.affected_pathway,
};

export { default as Summary } from "./Summary";
