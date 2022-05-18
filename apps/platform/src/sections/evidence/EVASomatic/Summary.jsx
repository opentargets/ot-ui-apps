import React from 'react';
import usePlatformApi from '../../../hooks/usePlatformApi';
import SummaryItem from '../../../components/Summary/SummaryItem';
import { dataTypesMap } from '../../../dataTypes';

import EVA_SOMATIC_SUMMARY from './EvaSomaticSummary.gql';

function Summary({ definition }) {
  const request = usePlatformApi(EVA_SOMATIC_SUMMARY);
  return (
    <SummaryItem
      definition={definition}
      request={request}
      renderSummary={({ evaSomaticSummary }) => {
        const { count } = evaSomaticSummary;
        return `${count} ${count === 1 ? 'entry' : 'entries'}`;
      }}
      subText={dataTypesMap.somatic_mutation}
    />
  );
}

Summary.fragments = {
  evaSomaticSummary: EVA_SOMATIC_SUMMARY,
};

export default Summary;
