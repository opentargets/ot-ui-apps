import { SummaryItem, usePlatformApi } from "ui";

import { definition } from ".";
import DRUG_WARNINGS_SUMMARY_FRAGMENT from "./DrugWarningsSummaryFragment.gql";

function Summary() {
  const request = usePlatformApi(DRUG_WARNINGS_SUMMARY_FRAGMENT);

  return (
    <SummaryItem
      definition={definition}
      request={request}
      renderSummary={({ hasBeenWithdrawn, blackBoxWarning }) => {
        if (hasBeenWithdrawn && blackBoxWarning) {
          return "Withdrawn • Black Box";
        }

        if (hasBeenWithdrawn) return "Withdrawn";

        if (blackBoxWarning) return "Black Box";

        return null;
      }}
    />
  );
}

Summary.fragments = {
  DrugWarningsSummaryFragment: DRUG_WARNINGS_SUMMARY_FRAGMENT,
};

export default Summary;
