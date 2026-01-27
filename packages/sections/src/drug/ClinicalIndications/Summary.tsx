import { SummaryItem, usePlatformApi } from "ui";

import { definition } from ".";
import CLINICAL_INDICATIONS_SUMMARY_FRAGMENT from "./ClinicalIndicationsSummaryFragment.gql";

function Summary() {
  const request = usePlatformApi(CLINICAL_INDICATIONS_SUMMARY_FRAGMENT);

  return (
    <SummaryItem
      definition={definition}
      request={request}
      renderSummary={data => "Indications"}  // !! LUPDATE ONCE HAVE API
      // renderSummary={data =>
      //   `${data.indications.count} indication${data.indications.count !== 1 ? "s" : ""}`
      // }
    />
  );
}

Summary.fragments = {
  ClinicalIndicationsSummaryFragment: CLINICAL_INDICATIONS_SUMMARY_FRAGMENT,
};

export default Summary;
