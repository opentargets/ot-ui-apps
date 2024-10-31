import { definitions as diseaseDefinitions } from "sections/src/disease/index";
import { definitions as drugDefinitions } from "sections/src/drug/index";
import { definitions as evidenceDefinitions } from "sections/src/evidence/index";
import { definitions as targetDefinitions } from "sections/src/target/index";
import { isPartnerPreview } from "../../AssociationsToolkit/utils";
import { Definition } from "../types";

export const getDefaultProfileFilters = (page: string): Array<Definition> => {
  const options = {
    disease: diseaseDefinitions,
    drug: drugDefinitions,
    evidence: evidenceDefinitions,
    target: targetDefinitions,
  };

  return options[page as keyof typeof options].filter(
    (def: Definition) => !def.isPrivate || (def.isPrivate && def.isPrivate === isPartnerPreview)
  );
};
