import React from 'react';

import SummaryItem from '../../../components/Summary/SummaryItem';
import usePlatformApi from '../../../hooks/usePlatformApi';

import OT_PROJECTS_SUMMARY_FRAGMENT from './OTProjectsSummaryFragment.gql';

function Summary({ definition }) {
  const request = usePlatformApi(OT_PROJECTS_SUMMARY_FRAGMENT);

  return (
    <SummaryItem
      definition={definition}
      request={request}
      renderSummary={({ otarProjects }) => {
        return (
          <>
            {otarProjects.length} OTAR project
            {otarProjects.length === 1 ? '' : 's'}
          </>
        );
      }}
    />
  );
}

Summary.fragments = {
  OTProjectsSummaryFragment: OT_PROJECTS_SUMMARY_FRAGMENT,
};

export default Summary;
