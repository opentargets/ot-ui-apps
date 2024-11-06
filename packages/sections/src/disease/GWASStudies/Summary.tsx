import { usePlatformApi, SummaryItem } from "ui";

import { definition } from ".";

function Summary() {
  const request = usePlatformApi();

  return <SummaryItem definition={definition} request={request} />;
}

export default Summary;
