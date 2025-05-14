import { dataTypesMap } from "@ot/constants";
import { SummaryItem, usePlatformApi } from "ui";

import { definition } from ".";
import CLINGEN_SUMMARY_FRAGMENT from "./ClinGenSummaryFragment.gql";

function Summary() {
  const request = usePlatformApi(CLINGEN_SUMMARY_FRAGMENT);

  return (
    <SummaryItem
      definition={definition}
      request={request}
      renderSummary={({ clingenSummary }) => {
        const { count } = clingenSummary;
        return `${count} ${count === 1 ? "entry" : "entries"}`;
      }}
      subText={dataTypesMap.genetic_association}
    />
  );
}

Summary.fragments = {
  ClinGenSummaryFragment: CLINGEN_SUMMARY_FRAGMENT,
};

export default Summary;
