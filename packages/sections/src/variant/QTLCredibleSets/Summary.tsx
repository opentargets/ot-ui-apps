import { SummaryItem, usePlatformApi } from "ui";

import { definition } from ".";
import QTL_CREDIBLE_SETS_SUMMARY from "./QTLCredibleSetsSummaryFragment.gql";

function Summary() {
  const request = usePlatformApi(QTL_CREDIBLE_SETS_SUMMARY);

  return <SummaryItem definition={definition} request={request} />;
}

Summary.fragments = {
  VariantQTLCredibleSetsSummaryFragment: QTL_CREDIBLE_SETS_SUMMARY,
};

export default Summary;
