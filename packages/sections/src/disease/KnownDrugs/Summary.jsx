import { SummaryItem, usePlatformApi } from "ui";

import { definition } from ".";
import KNOWN_DRUGS_SUMMARY_FRAGMENT from "./KnownDrugsSummaryFragment.gql";

function Summary() {
  const request = usePlatformApi(KNOWN_DRUGS_SUMMARY_FRAGMENT);

  return (
    <SummaryItem
      definition={definition}
      request={request}
      renderSummary={data => (
        <>
          {(data.knownDrugs.uniqueDrugs || 0).toLocaleString()} drugs with{" "}
          {(data.knownDrugs.uniqueTargets || 0).toLocaleString()} targets
        </>
      )}
    />
  );
}

Summary.fragments = {
  DiseaseKnownDrugsSummaryFragment: KNOWN_DRUGS_SUMMARY_FRAGMENT,
};

export default Summary;
