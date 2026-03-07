import { SummaryItem, usePlatformApi } from "ui";

import { definition } from ".";
import DRUGS_AND_CLINICAL_CANDIDATES_SUMMARY_FRAGMENT from "./DrugsSummaryFragment.gql";

function Summary() {
  const request = usePlatformApi(DRUGS_AND_CLINICAL_CANDIDATES_SUMMARY_FRAGMENT);
  const AnySummaryItem = SummaryItem as any;

  return (
    <AnySummaryItem
      definition={definition}
      request={request}
      renderSummary={() => "Drugs and clinical candidates"}
    />
  );
}

Summary.fragments = {
  DrugsSummaryFragment: DRUGS_AND_CLINICAL_CANDIDATES_SUMMARY_FRAGMENT,
};

export default Summary;
