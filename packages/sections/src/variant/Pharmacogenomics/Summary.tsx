import { SummaryItem, usePlatformApi } from "ui";

import { definition } from ".";
import PHARMACOGENOMICS_SUMMARY from "./PharmacogenomicsSummaryFragment.gql";

function Summary() {
  const request = usePlatformApi(PHARMACOGENOMICS_SUMMARY);

  return <SummaryItem definition={definition} request={request} />;
}

Summary.fragments = {
  VariantPharmacogenomicsSummaryFragment: PHARMACOGENOMICS_SUMMARY,
};

export default Summary;
