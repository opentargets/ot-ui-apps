import { SummaryItem, usePlatformApi } from "ui";

import { definition } from ".";
import OVERLAPPING_VARIANTS_SUMMARY from "./OverlappingVariantsSummary.gql";

function Summary() {
  const request = usePlatformApi(OVERLAPPING_VARIANTS_SUMMARY);

  return <SummaryItem definition={definition} request={request} />;
}

Summary.fragments = {
  OverlappingVariantsSummaryFragment: OVERLAPPING_VARIANTS_SUMMARY,
};

export default Summary;
