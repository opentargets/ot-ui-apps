import { SummaryItem, usePlatformApi } from "ui";

import { definition } from ".";
import { dataTypesMap } from "../../dataTypes";
import GWAS_CREDIBLE_SETS_SUMMARY_FRAGMENT from "./GWASCredibleSetsSummary.gql";

function Summary() {
  const request = usePlatformApi(GWAS_CREDIBLE_SETS_SUMMARY_FRAGMENT);

  return (
    <SummaryItem
      definition={definition}
      request={request}
      renderSummary={data =>
        `${data.openTargetsGenetics.count} entr${
          data.openTargetsGenetics.count === 1 ? "y" : "ies"
        }`
      }
      subText={dataTypesMap.genetic_association}
    />
  );
}

Summary.fragments = {
  OpenTargetsGeneticsSummaryFragment: GWAS_CREDIBLE_SETS_SUMMARY_FRAGMENT,
};

export default Summary;
