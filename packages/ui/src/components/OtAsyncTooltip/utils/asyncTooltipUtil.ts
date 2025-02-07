import DRUG_TOOLTIP_QUERY from "../queries/DrugTooltipQuery.gql";
import DISEASE_TOOLTIP_QUERY from "../queries/DiseaseTooltipQuery.gql";
import STUDY_TOOLTIP_QUERY from "../queries/StudyTooltipQuery.gql";
import TARGET_TOOLTIP_QUERY from "../queries/TargetTooltipQuery.gql";
import VARIANT_TOOLTIP_QUERY from "../queries/VariantTooltipQuery.gql";
import {
  faChartBar,
  faDna,
  faMapPin,
  faPrescriptionBottleAlt,
  faStethoscope,
  faTag,
} from "@fortawesome/free-solid-svg-icons";

export function getQueryVariables(entity: string, id: string): Record<string, string> {
  switch (entity) {
    case "drug":
      return { chemblId: id };
    case "disease":
      return { efoId: id };
    case "target":
      return { ensgId: id };
    case "variant":
      return { variantId: id };
    case "study":
      return { studyId: id };
    default:
      return { id };
  }
}

export const getEntityQuery = (entity: string) => {
  switch (entity) {
    case "drug":
      return DRUG_TOOLTIP_QUERY;
    case "disease":
      return DISEASE_TOOLTIP_QUERY;
    case "study":
      return STUDY_TOOLTIP_QUERY;
    case "target":
      return TARGET_TOOLTIP_QUERY;
    case "variant":
      return VARIANT_TOOLTIP_QUERY;
    default:
      return;
  }
};

export const getEntityIcon = (entity: string) => {
  switch (entity) {
    case "drug":
      return faPrescriptionBottleAlt;
    case "disease":
      return faStethoscope;
    case "study":
      return faChartBar;
    case "target":
      return faDna;
    case "variant":
      return faMapPin;
    default:
      return faTag;
  }
};
