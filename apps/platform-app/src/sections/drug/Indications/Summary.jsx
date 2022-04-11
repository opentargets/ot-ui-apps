import React from 'react';

import usePlatformApi from '../../../hooks/usePlatformApi';
import SummaryItem from '../../../components/Summary/SummaryItem';

import INDICATIONS_SUMMARY_FRAGMENT from './IndicationsSummaryFragment.gql';

function Summary({ definition }) {
  const request = usePlatformApi(INDICATIONS_SUMMARY_FRAGMENT);

  return (
    <SummaryItem
      definition={definition}
      request={request}
      renderSummary={data =>
        `${data.indications.count} indication${
          data.indications.count !== 1 ? 's' : ''
        }`
      }
    />
  );
}

Summary.fragments = {
  IndicationsSummaryFragment: INDICATIONS_SUMMARY_FRAGMENT,
};

export default Summary;
