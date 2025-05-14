import { SummaryItem, usePlatformApi } from "ui";

import { definition } from ".";
import GENETIC_CONSTRAINT_FRAGMENT from "./GeneticConstraintFragment.gql";
import upperBin6Map from "./upperBin6Map";

function Summary() {
  const request = usePlatformApi(GENETIC_CONSTRAINT_FRAGMENT);

  return (
    <SummaryItem
      definition={definition}
      request={request}
      renderSummary={({ geneticConstraint }) => {
        const lof = geneticConstraint.find((gc) => gc.constraintType === "lof");
        return upperBin6Map[lof.upperBin6];
      }}
    />
  );
}

Summary.fragments = {
  GeneticConstraintFragment: GENETIC_CONSTRAINT_FRAGMENT,
};

export default Summary;
