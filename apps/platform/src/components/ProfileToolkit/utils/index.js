import { definitions as diseaseDefinitions } from "sections/src/disease/index";
import { definitions as drugDefinitions } from "sections/src/drug/index";
import { definitions as evidenceDefinitions } from "sections/src/evidence/index";
import { definitions as targetDefinitions } from "sections/src/target/index";
import { isPartnerPreview } from "../../AssociationsToolkit/utils";

export const getDefaultProfileFilters = page => {
  const options = {
    disease: diseaseDefinitions,
    drug: drugDefinitions,
    evidence: evidenceDefinitions,
    target: targetDefinitions,
  };

  return options[page].filter(
    def => !def.isPrivate || (def.isPrivate && def.isPrivate === isPartnerPreview)
  );
};
