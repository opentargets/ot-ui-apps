import { SummaryItem, usePlatformApi } from "ui";

import { definition } from ".";
import LOCUS2GENE_SUMMARY from "./Locus2GeneQueryFragment.gql";
import { ReactNode } from "react";

function Summary(): ReactNode {
  const request = usePlatformApi(LOCUS2GENE_SUMMARY);

  return <SummaryItem definition={definition} request={request} />;
}

Summary.fragments = {
  Locus2GeneQueryFragment: LOCUS2GENE_SUMMARY,
};

export default Summary;
