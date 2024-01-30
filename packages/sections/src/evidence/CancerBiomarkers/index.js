import { isPrivateEvidenceSection } from "../../utils/partnerPreviewUtils";
import { dataTypesMap } from "../../dataTypes";
// import { dataSourcesMap } from '../../../dataSources';

const id = "cancer_biomarkers";
export const definition = {
  id,
  name: "Cancer Biomarkers",
  shortName: "CB",
  hasData: data => data.cancerBiomarkersSummary.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
  dataType: dataTypesMap.affected_pathway,
  // dataType: dataSourcesMap.affected_pathway,
};

export { default as Summary } from "./Summary";
