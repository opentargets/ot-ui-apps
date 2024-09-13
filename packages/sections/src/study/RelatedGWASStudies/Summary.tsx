import { SummaryItem, usePlatformApi } from "ui";

import { definition } from ".";
import RELATED_GWAS_STUDIES_SUMMARY from "./RelatedGWASStudiesSummaryFragment.gql";

function Summary() {
  const request = usePlatformApi(RELATED_GWAS_STUDIES_SUMMARY);
  
  return <SummaryItem definition={definition} request={request} />;
}

Summary.fragments = {
  RelatedGWASStudiesSummaryFragment: RELATED_GWAS_STUDIES_SUMMARY,
};

export default Summary;