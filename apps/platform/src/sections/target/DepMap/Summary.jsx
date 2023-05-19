import React from 'react';
import _ from 'lodash';

import usePlatformApi from '../../../hooks/usePlatformApi';
import SummaryItem from '../../../components/Summary/SummaryItem';

// TODO: import correct fragment when available
import DEPMAP_SUMMARY_FRAGMENT from './DepmapSummaryFragment.gql';

function Summary({ definition }) {
  // TODO: replace this
  const request = usePlatformApi(DEPMAP_SUMMARY_FRAGMENT);

  return (
    <SummaryItem
      definition={definition}
      request={request}
      renderSummary={data => {
        return (
          <>
            --TODO-- • 28 tissues
          </>
        );
      }}
    />
  );
}

Summary.fragments = {
  CancerHallmarksSummaryFragment: DEPMAP_SUMMARY_FRAGMENT,
};

export default Summary;
