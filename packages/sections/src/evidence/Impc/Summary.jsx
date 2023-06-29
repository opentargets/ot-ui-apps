import { SummaryItem } from "ui";

import { dataTypesMap } from "../../dataTypes";
import usePlatformApi from "../../hooks/usePlatformApi";
import IMCP_SUMMARY_FRAGMENT from "./IMCPSummaryFragment.gql";

function Summary({ definition }) {
  const request = usePlatformApi(IMCP_SUMMARY_FRAGMENT);

  return (
    <SummaryItem
      definition={definition}
      request={request}
      renderSummary={(data) =>
        `${data.impc.count} entr${data.impc.count === 1 ? "y" : "ies"}`
      }
      subText={dataTypesMap.animal_model}
    />
  );
}

Summary.fragments = {
  IMCPSummaryFragment: IMCP_SUMMARY_FRAGMENT,
};

export default Summary;
