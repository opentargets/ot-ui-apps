import { SummaryItem, usePlatformApi } from "ui";
import KNOWN_DRUGS_SUMMARY_FRAGMENT from "./KnownDrugsSummaryFragment.gql";

import { definition } from ".";

function Summary() {
  const request = usePlatformApi(KNOWN_DRUGS_SUMMARY_FRAGMENT);

  return (
    <SummaryItem
      definition={definition}
      request={request}
      renderSummary={data => (
        <>
          {(data.knownDrugs.uniqueTargets || 0).toLocaleString()} target
          {data.knownDrugs.uniqueTargets === 1 ? "" : "s"} and{" "}
          {(data.knownDrugs.uniqueDiseases || 0).toLocaleString()} indication
          {data.knownDrugs.uniqueDiseases === 1 ? "" : "s"}
        </>
      )}
    />
  );
}

Summary.fragments = {
  DrugKnownDrugsSummaryFragment: KNOWN_DRUGS_SUMMARY_FRAGMENT,
};

export default Summary;
