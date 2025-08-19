import { SummaryItem, usePlatformApi } from "ui";

import { definition } from ".";
import INTERVALS_SUMMARY from "./IntervalsSummaryFragment.gql";

function Summary() {
  const request = usePlatformApi(INTERVALS_SUMMARY);

  return <SummaryItem definition={definition} request={request} />;
}

Summary.fragments = {
  IntervalsSummaryFragment: INTERVALS_SUMMARY,
};

export default Summary; 