// import { isPrivateEvidenceSection } from "../../utils/partnerPreviewUtils";

const id = "in_silico_predictors";
export const definition = {
  id,
  name: "In silico predictors",
  shortName: "VP",
  // UPDATE HERE ONCE HAVE PROPER DATA
  hasData: data => true,  // data.uniprotVariantsSummary.count > 0,
  isPrivate: false,  // isPrivateEvidenceSection(id),
};
