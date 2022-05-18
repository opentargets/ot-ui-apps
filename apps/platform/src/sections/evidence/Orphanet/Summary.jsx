import React from 'react';
import usePlatformApi from '../../../hooks/usePlatformApi';
import SummaryItem from '../../../components/Summary/SummaryItem';
import { dataTypesMap } from '../../../dataTypes';

import ORPHANET_SUMMARY from './OrphanetSummaryFragment.gql';

function Summary({ definition }) {
  const request = usePlatformApi(ORPHANET_SUMMARY);
  return (
    <SummaryItem
      definition={definition}
      request={request}
      renderSummary={({ orphanetSummary }) => {
        const { count } = orphanetSummary;
        return `${count} ${count === 1 ? 'entry' : 'entries'}`;
      }}
      subText={dataTypesMap.genetic_association}
    />
  );
}

Summary.fragments = {
  OrphanetSummaryFragment: ORPHANET_SUMMARY,
};

export default Summary;
