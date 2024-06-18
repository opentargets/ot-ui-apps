import { SummaryItem, usePlatformApi } from "ui";

import { definition } from ".";

function Summary() {

  // !! USE PLACEHOLDER REQUEST FOR NOW !!
  // const request = usePlatformApi(UNIPROT_VARIANTS_SUMMARY);
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
      subText=""
      // subText={dataTypesMapTyped.genetic_association}
    />
  );
}

// !!!!!!!!!!!!!
// Summary.fragments = {
//   ?????????????
// };

export default Summary;