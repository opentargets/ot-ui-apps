import React from 'react';

import SummaryItem from '../../../components/Summary/SummaryItem';
import usePlatformApi from '../../../hooks/usePlatformApi';
import { dataTypesMap } from '../../../dataTypes';

import EUROPE_PMC_SUMMARY_FRAGMENT from './EuropePmcSummaryFragment.gql';

function Summary({ definition }) {
  const request = usePlatformApi(EUROPE_PMC_SUMMARY_FRAGMENT);

  return (
    <SummaryItem
      definition={definition}
      request={request}
      renderSummary={data =>
        `${data.europePmc.count} entr${
          data.europePmc.count === 1 ? 'y' : 'ies'
        }`
      }
      subText={dataTypesMap.literature}
    />
  );
}

Summary.fragments = {
  EuropePmcSummaryFragment: EUROPE_PMC_SUMMARY_FRAGMENT,
};

export default Summary;
