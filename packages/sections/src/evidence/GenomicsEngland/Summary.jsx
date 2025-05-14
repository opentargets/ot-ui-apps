import { SummaryItem, usePlatformApi } from "ui";

import { dataTypesMap } from "@ot/constants";
import { definition } from ".";
import GENOMICS_ENGLAND_SUMMARY_FRAGMENT from "./GenomicsEnglandSummaryFragment.gql";

function Summary() {
  const request = usePlatformApi(GENOMICS_ENGLAND_SUMMARY_FRAGMENT);

  return (
    <SummaryItem
      definition={definition}
      request={request}
      renderSummary={(data) =>
        `${data.genomicsEngland.count} entr${data.genomicsEngland.count === 1 ? "y" : "ies"}`
      }
      subText={dataTypesMap.genetic_association}
    />
  );
}

Summary.fragments = {
  GenomicsEnglandSummaryFragment: GENOMICS_ENGLAND_SUMMARY_FRAGMENT,
};

export default Summary;
