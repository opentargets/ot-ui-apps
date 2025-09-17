import { SummaryItem, usePlatformApi } from "ui";

import { definition } from ".";
import VARIANT_EFFECT_PREDICTOR_SUMMARY from "./VariantEffectPredictorSummaryFragment.gql";

function Summary() {
  const request = usePlatformApi(VARIANT_EFFECT_PREDICTOR_SUMMARY);

  return <SummaryItem definition={definition} request={request} />;
}

Summary.fragments = {
  VariantEffectPredictorSummaryFragment: VARIANT_EFFECT_PREDICTOR_SUMMARY,
};

export default Summary;
