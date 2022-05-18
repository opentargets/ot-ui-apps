import React from 'react';

import SummaryItem from '../../../components/Summary/SummaryItem';
import usePlatformApi from '../../../hooks/usePlatformApi';

import PATHWAYS_SUMMARY_FRAGMENT from './PathwaysSummary.gql';

function Summary({ definition }) {
  const request = usePlatformApi(PATHWAYS_SUMMARY_FRAGMENT);

  return (
    <SummaryItem
      definition={definition}
      request={request}
      renderSummary={({ pathways }) => `${pathways.length} Reactome pathways`}
    />
  );
}

Summary.fragments = {
  PathwaysSummaryFragment: PATHWAYS_SUMMARY_FRAGMENT,
};

export default Summary;
