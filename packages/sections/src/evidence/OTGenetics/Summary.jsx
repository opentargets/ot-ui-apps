import { SummaryItem, usePlatformApi } from "ui";

import { definition } from ".";
import { dataTypesMap } from "../../dataTypes";
import OPEN_TARGETS_GENETICS_SUMMARY_FRAGMENT from "./OpenTargetsGeneticsSummary.gql";

function Summary() {
  const request = usePlatformApi(OPEN_TARGETS_GENETICS_SUMMARY_FRAGMENT);

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
  OpenTargetsGeneticsSummaryFragment: OPEN_TARGETS_GENETICS_SUMMARY_FRAGMENT,
};

export default Summary;
