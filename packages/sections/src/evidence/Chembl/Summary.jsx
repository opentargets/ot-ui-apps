import { usePlatformApi, SummaryItem } from "ui";
import { dataTypesMap } from "../../dataTypes";
import { definition } from ".";

import CHEMBL_SUMMARY_FRAGMENT from "./ChemblSummaryFragment.gql";

function Summary() {
  const request = usePlatformApi(CHEMBL_SUMMARY_FRAGMENT);

  return (
    <SummaryItem
      definition={definition}
      request={request}
      renderSummary={({ chembl }) => {
        const { count } = chembl;
        return `${count} ${count === 1 ? "entry" : "entries"}`;
      }}
      subText={dataTypesMap.known_drug}
    />
  );
}

Summary.fragments = {
  ChemblSummaryFragment: CHEMBL_SUMMARY_FRAGMENT,
};

export default Summary;
