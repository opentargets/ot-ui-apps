import { SummaryItem, usePlatformApi } from "ui";

import { definition } from ".";
import DRUGS_SUMMARY_FRAGMENT from "./DrugsSummaryFragment.gql";

function Summary() {
  const request = usePlatformApi(DRUGS_SUMMARY_FRAGMENT);
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
  DrugsSummaryFragment: DRUGS_SUMMARY_FRAGMENT,
};

export default Summary;
