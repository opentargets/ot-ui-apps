import { SummaryItem, usePlatformApi } from "ui";

import { dataTypesMap } from "@ot/constants";
import { definition } from ".";
import ORPHANET_SUMMARY from "./OrphanetSummaryFragment.gql";

function Summary() {
  const request = usePlatformApi(ORPHANET_SUMMARY);
  return (
    <SummaryItem
      definition={definition}
      request={request}
      renderSummary={({ orphanetSummary }) => {
        const { count } = orphanetSummary;
        return `${count} ${count === 1 ? "entry" : "entries"}`;
      }}
      subText={dataTypesMap.genetic_association}
    />
  );
}

Summary.fragments = {
  OrphanetSummaryFragment: ORPHANET_SUMMARY,
};

export default Summary;
