import { SummaryItem, usePlatformApi } from "ui";

import { definition } from ".";
import GWAS_COLOC_SUMMARY from "./GWASColocSummaryFragment.gql";

function Summary() {
  const request = usePlatformApi(GWAS_COLOC_SUMMARY);

  return <SummaryItem definition={definition} request={request} />;
}

Summary.fragments = {
  GWASColocSummaryFragment: GWAS_COLOC_SUMMARY,
};

export default Summary;
