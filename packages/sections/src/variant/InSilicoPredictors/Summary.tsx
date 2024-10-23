import { SummaryItem, usePlatformApi } from "ui";

import { definition } from ".";
import IN_SILICO_PREDICTORS_SUMMARY from "./InSilicoPredictorsSummaryFragment.gql";

function Summary() {
  const request = usePlatformApi(IN_SILICO_PREDICTORS_SUMMARY);

  return <SummaryItem definition={definition} request={request} />;
}

Summary.fragments = {
  InSilicoPredictorsSummaryFragment: IN_SILICO_PREDICTORS_SUMMARY,
};

export default Summary;
