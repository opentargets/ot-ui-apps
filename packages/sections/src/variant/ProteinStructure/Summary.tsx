import { SummaryItem, usePlatformApi } from "ui";

import { definition } from ".";
import PROTEIN_STRUCTURE_SUMMARY from "./ProteinStructureSummaryFragment.gql";

function Summary() {
  const request = usePlatformApi(PROTEIN_STRUCTURE_SUMMARY);

  return <SummaryItem definition={definition} request={request} />;
}

Summary.fragments = {
  ProteinStructureSummaryFragment: PROTEIN_STRUCTURE_SUMMARY,
};

export default Summary;
