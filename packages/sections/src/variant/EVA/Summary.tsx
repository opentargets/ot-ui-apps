import { SummaryItem, usePlatformApi } from "ui";

import { definition } from ".";
import { dataTypesMap } from "../../dataTypes";
// import EVA_SUMMARY from "./EVASummaryQuery.gql";

function Summary() {
  
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
      // renderSummary={({ evaSummary }) => {
      //   const { count } = evaSummary;
      //   return `${count} ${count === 1 ? "entry" : "entries"}`;
      // }}
    />
  );
}

// !!!!!!!!!!!
// Summary.fragments = {
//   evaSummary: EVA_SUMMARY,
// };

export default Summary;