import { SummaryItem, usePlatformApi } from "ui";

import { definition } from ".";
import ONTOLOGY_SUMMARY_FRAGMENT from "./OntologySummaryFragment.gql";

function Summary() {
  const request = usePlatformApi(ONTOLOGY_SUMMARY_FRAGMENT);

  return (
    <SummaryItem
      definition={definition}
      request={request}
      renderSummary={(data) =>
        data.isTherapeuticArea
          ? "Therapeutic area"
          : `Belongs to ${data.therapeuticAreas.length} therapeutic areas`
      }
    />
  );
}

Summary.fragments = {
  OntologySummaryFragment: ONTOLOGY_SUMMARY_FRAGMENT,
};

export default Summary;
