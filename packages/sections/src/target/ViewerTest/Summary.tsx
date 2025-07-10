import { SummaryItem, usePlatformApi } from "ui";

import { definition } from ".";
import VIEWER_TEST_SUMMARY from "./ViewerTestSummary.gql";

function Summary() {
  const request = usePlatformApi(VIEWER_TEST_SUMMARY);

  return <SummaryItem definition={definition} request={request} />;
}

Summary.fragments = {
  ViewerTestSummaryFragment: VIEWER_TEST_SUMMARY,
};

export default Summary;
