import { usePlatformApi } from "ui";
import SummaryItem from "../../components/Summary/SummaryItem";

import OT_PROJECTS_SUMMARY_FRAGMENT from "./OTProjectsSummaryFragment.gql";

function Summary({ definition }) {
  const request = usePlatformApi(OT_PROJECTS_SUMMARY_FRAGMENT);

  return (
    <SummaryItem
      definition={definition}
      request={request}
      renderSummary={({ otarProjects }) => (
        <>
          {otarProjects.length} OTAR project
          {otarProjects.length === 1 ? "" : "s"}
        </>
      )}
    />
  );
}

Summary.fragments = {
  OTProjectsSummaryFragment: OT_PROJECTS_SUMMARY_FRAGMENT,
};

export default Summary;
