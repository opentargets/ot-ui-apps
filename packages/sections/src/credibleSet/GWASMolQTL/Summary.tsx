import { SummaryItem, usePlatformApi } from "ui";

import { definition } from ".";
import GWASMOLQTL_SUMMARY from "./GWASMolQTLSummaryFragment.gql";

function Summary() {
  const request = usePlatformApi(GWASMOLQTL_SUMMARY);

  return <SummaryItem definition={definition} request={request} />;
}

Summary.fragments = {
  GWASMolQTLSummaryFragment: GWASMOLQTL_SUMMARY,
};

export default Summary;
