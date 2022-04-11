import React from 'react';

import SummaryItem from '../../../components/Summary/SummaryItem';
import usePlatformApi from '../../../hooks/usePlatformApi';
import countHomologues from './countHomologues';

import COMP_GENOMICS_SUMMARY_FRAGMENT from './CompGenomicsSummaryFragment.gql';

function Summary({ definition }) {
  const request = usePlatformApi(COMP_GENOMICS_SUMMARY_FRAGMENT);

  return (
    <SummaryItem
      definition={definition}
      request={request}
      renderSummary={({ homologues }) => {
        const { orthologueCount, paralogueCount } = countHomologues(homologues);
        return `${orthologueCount} orthologues and ${paralogueCount} paralogues`;
      }}
    />
  );
}

Summary.fragments = {
  CompGenomicsSummaryFragment: COMP_GENOMICS_SUMMARY_FRAGMENT,
};

export default Summary;
