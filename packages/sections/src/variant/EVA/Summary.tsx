import { SummaryItem, usePlatformApi } from "ui";

import { definition } from ".";
import EVA_SUMMARY from "./EVASummaryQuery.gql";

function Summary() {
  const request = usePlatformApi(EVA_SUMMARY);

  return (
    <SummaryItem definition={definition} request={request} />
  );
}

Summary.fragments = {
  evaSummary: EVA_SUMMARY,
};

export default Summary;