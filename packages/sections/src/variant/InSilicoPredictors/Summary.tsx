import { SummaryItem, usePlatformApi } from "ui";

import { definition } from ".";
import { dataTypesMap } from "../../dataTypes";
// import UNIPROT_VARIANTS_SUMMARY from "./UniprotVariantsSummaryQuery.gql";

function Summary() {

  // !! THIS IS UGLY BUT AVOIDS ADDING TYPES IN dataType FILE FOR NOW
  type dataTypesMapType = {
    [index: string]: number;
  };
  const dataTypesMapTyped = dataTypesMap as dataTypesMapType; 

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
      // renderSummary={({ uniprotVariantsSummary }) => {
      //   const { count } = uniprotVariantsSummary;
      //   return `${count} ${count === 1 ? "entry" : "entries"}`;
      // }}
      subText={dataTypesMapTyped.genetic_association}  // !! LEAVE AS GENETIC ASSOCITION FOR NOW
    />
  );
}

// !!!!!!!!!!!!!
// Summary.fragments = {
//   UniprotVariantsSummary: UNIPROT_VARIANTS_SUMMARY,
// };

export default Summary;
