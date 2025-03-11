import { SummaryItem, usePlatformApi } from "ui";

import { definition } from ".";
import VARIANT_EFFECT_SUMMARY from "./VariantEffectSummaryFragment.gql";

function Summary() {
  const request = usePlatformApi(VARIANT_EFFECT_SUMMARY);

  return <SummaryItem definition={definition} request={request} />;
}

Summary.fragments = {
  VariantEffectSummaryFragment: VARIANT_EFFECT_SUMMARY,
};

export default Summary;
