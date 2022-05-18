import React from 'react';
import usePlatformApi from '../../../hooks/usePlatformApi';
import SummaryItem from '../../../components/Summary/SummaryItem';
import { dataTypesMap } from '../../../dataTypes';

import EVA_SUMMARY from './EVASummaryQuery.gql';

function Summary({ definition }) {
  const request = usePlatformApi(EVA_SUMMARY);
  return (
    <SummaryItem
      definition={definition}
      request={request}
      renderSummary={({ evaSummary }) => {
        const { count } = evaSummary;
        return `${count} ${count === 1 ? 'entry' : 'entries'}`;
      }}
      subText={dataTypesMap.genetic_association}
    />
  );
}

Summary.fragments = {
  evaSummary: EVA_SUMMARY,
};

export default Summary;
