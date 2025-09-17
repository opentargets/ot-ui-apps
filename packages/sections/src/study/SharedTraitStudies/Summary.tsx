import { SummaryItem, usePlatformApi } from "ui";

import { definition } from ".";
import SHARED_TRAIT_STUDIES_FRAGMENT from "./SharedTraitStudiesFragment.gql";

function Summary() {
  const request = usePlatformApi();

  return <SummaryItem definition={definition} request={request} />;
}

Summary.fragments = {
  StudySharedTraitStudiesFragment: SHARED_TRAIT_STUDIES_FRAGMENT,
};

export default Summary;
