import React from 'react';

import SummaryItem from '../../../components/Summary/SummaryItem';
import usePlatformApi from '../../../hooks/usePlatformApi';
import { dataTypesMap } from '../../../dataTypes';

import SLAPENRICH_SUMMARY_FRAGMENT from './SlapEnrichSummaryFragment.gql';

function Summary({ definition }) {
  const request = usePlatformApi(SLAPENRICH_SUMMARY_FRAGMENT);

  return (
    <SummaryItem
      definition={definition}
      request={request}
      renderSummary={data =>
        `${data.slapEnrich.count} entr${
          data.slapEnrich.count === 1 ? 'y' : 'ies'
        }`
      }
      subText={dataTypesMap.affected_pathway}
    />
  );
}

Summary.fragments = {
  SlapEnrichSummaryFragment: SLAPENRICH_SUMMARY_FRAGMENT,
};

export default Summary;
