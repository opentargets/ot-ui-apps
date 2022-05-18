import React from 'react';
import SummaryItem from '../../../components/Summary/SummaryItem';
import usePlatformApi from '../../../hooks/usePlatformApi';

import KNOWN_DRUGS_SUMMARY_FRAGMENT from './KnownDrugsSummary.gql';

function Summary({ definition }) {
  const request = usePlatformApi(KNOWN_DRUGS_SUMMARY_FRAGMENT);

  return (
    <SummaryItem
      definition={definition}
      request={request}
      renderSummary={data => (
        <>
          {(data.knownDrugs.uniqueDrugs || 0).toLocaleString()} drugs with{' '}
          {(data.knownDrugs.uniqueDiseases || 0).toLocaleString()} indications
        </>
      )}
    />
  );
}

Summary.fragments = {
  TargetKnownDrugsSummaryFragment: KNOWN_DRUGS_SUMMARY_FRAGMENT,
};

export default Summary;
