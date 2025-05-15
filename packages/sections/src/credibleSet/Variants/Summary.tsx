import { SummaryItem, usePlatformApi } from "ui";

import { definition } from ".";
import VARIANTS_SUMMARY from "./VariantsSummaryFragment.gql";

function Summary() {
  const request = usePlatformApi(VARIANTS_SUMMARY);

  return <SummaryItem definition={definition} request={request} />;
}

Summary.fragments = {
  VariantsSummaryFragment: VARIANTS_SUMMARY,
};

export default Summary;
