import { SummaryItem, usePlatformApi } from "ui";

import { definition } from ".";
import PROTVISTA_SUMMARY_FRAGMENT from "./summaryQuery.gql";

function Summary() {
  const request = usePlatformApi(PROTVISTA_SUMMARY_FRAGMENT);

  return (
    <SummaryItem
      definition={definition}
      request={request}
      renderSummary={() => "Positional, Structural and Functional Information"}
    />
  );
}

Summary.fragments = {
  ProtVistaSummaryFragment: PROTVISTA_SUMMARY_FRAGMENT,
};

export default Summary;
