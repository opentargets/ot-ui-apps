import { SummaryItem, usePlatformApi } from "ui";

import { definition } from ".";
import MOLQTL_COLOC__SUMMARY from "./MolQTLColocSummaryFragment.gql";

function Summary() {
  const request = usePlatformApi(MOLQTL_COLOC__SUMMARY);

  return <SummaryItem definition={definition} request={request} />;
}

Summary.fragments = {
  MolQTLColocSummaryFragment: MOLQTL_COLOC__SUMMARY,
};

export default Summary;
