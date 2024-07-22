import { SummaryItem, usePlatformApi } from "ui";

import { definition } from ".";
// import PHARMACOGENOMICS_SUMMARY_FRAGMENT from "./PharmacogenomicsSummary.gql";

function Summary() {
  // const request = usePlatformApi(PHARMACOGENOMICS_SUMMARY_FRAGMENT);

  // !! USE PLACEHOLDER REQUEST FOR NOW !!
  // const request = usePlatformApi(EVA_SUMMARY);
  const request = {
    loading: false,
    error: undefined,
    data: true,  // data is not actually used by summary - only cares if there is data
  };

  return (
    <SummaryItem
      definition={definition}
      request={request}
      renderSummary={() => {}}  // !! renderSummary PROP NOT USED ANYMORE ANYWAY? 
      // renderSummary={({ pharmacogenomics }) =>
      //   `${pharmacogenomics.length} Pharmacogenomics Records`
      // }
    />
  );
}

// Summary.fragments = {
//   PharmacogenomicsSummaryFragment: PHARMACOGENOMICS_SUMMARY_FRAGMENT,
// };

export default Summary;
