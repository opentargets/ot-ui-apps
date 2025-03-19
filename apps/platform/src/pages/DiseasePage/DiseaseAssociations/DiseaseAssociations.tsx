import { ReactElement } from "react";
import { AssociationsView } from "../../../components/AssociationsToolkit";
import { ENTITY } from "../../../components/AssociationsToolkit/types";
import DISEASE_ASSOCIATIONS_QUERY from "./DiseaseAssociationsQuery.gql";

type DiseaseAssociationsProps = {
  efoId: string;
};

function DiseaseAssociations(pros: DiseaseAssociationsProps): ReactElement {
  return (
    <AssociationsView id={pros.efoId} entity={ENTITY.DISEASE} query={DISEASE_ASSOCIATIONS_QUERY} />
  );
}

export default DiseaseAssociations;
