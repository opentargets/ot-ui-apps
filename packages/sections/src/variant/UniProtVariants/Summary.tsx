import { SummaryItem, usePlatformApi } from "ui";

import { definition } from ".";
import UNIPROT_VARIANTS_SUMMARY from "./UniProtVariantsSummaryFragment.gql";

function Summary() {
  const request = usePlatformApi(UNIPROT_VARIANTS_SUMMARY);

  return <SummaryItem definition={definition} request={request} />;
}

Summary.fragments = {
  UniProtVariantsSummaryFragment: UNIPROT_VARIANTS_SUMMARY,
};

export default Summary;
