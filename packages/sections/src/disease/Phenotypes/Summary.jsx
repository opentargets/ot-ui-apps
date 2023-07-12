import { usePlatformApi, SummaryItem } from "ui";

import PHENOTYPES_SUMMARY_FRAGMENT from "./PhenotypesSummaryFragment.gql";
import { definition } from ".";

function Summary() {
  const request = usePlatformApi(PHENOTYPES_SUMMARY_FRAGMENT);

  return (
    <SummaryItem
      definition={definition}
      request={request}
      renderSummary={(data) => <>{data.phenotypes?.count || 0} phenotypes</>}
    />
  );
}

Summary.fragments = { PhenotypesSummaryFragment: PHENOTYPES_SUMMARY_FRAGMENT };

export default Summary;
