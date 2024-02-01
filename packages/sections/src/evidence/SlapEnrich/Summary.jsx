import { SummaryItem, usePlatformApi } from "ui";

import { definition } from ".";
import { dataTypesMap } from "../../dataTypes";
import SLAPENRICH_SUMMARY_FRAGMENT from "./SlapEnrichSummaryFragment.gql";

function Summary() {
  const request = usePlatformApi(SLAPENRICH_SUMMARY_FRAGMENT);

  return (
    <SummaryItem
      definition={definition}
      request={request}
      renderSummary={data =>
        `${data.slapEnrich.count} entr${data.slapEnrich.count === 1 ? "y" : "ies"}`
      }
      subText={dataTypesMap.affected_pathway}
    />
  );
}

Summary.fragments = {
  SlapEnrichSummaryFragment: SLAPENRICH_SUMMARY_FRAGMENT,
};

export default Summary;
