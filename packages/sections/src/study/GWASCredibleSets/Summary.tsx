import { SummaryItem, usePlatformApi } from "ui";

import { definition } from ".";
import GWAS_CREDIBLE_SETS_SUMMARY from "./GWASCredibleSetsSummaryFragment.gql";

function Summary() {
  const request = usePlatformApi(GWAS_CREDIBLE_SETS_SUMMARY);

  return <SummaryItem definition={definition} request={request} />;
}

Summary.fragments = {
  StudyGWASCredibleSetsSummaryFragment: GWAS_CREDIBLE_SETS_SUMMARY,
};

export default Summary;
