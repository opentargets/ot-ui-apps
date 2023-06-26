import React from 'react';
import usePlatformApi from '../../../hooks/usePlatformApi';
import SummaryItem from '../../../components/Summary/SummaryItem';
import { dataTypesMap } from '../../../dataTypes';

import CRISPR_SUMMARY from './CrisprScreenSummary.gql';

function Summary({ definition }) {
  const request = usePlatformApi(CRISPR_SUMMARY);
  return (
    <SummaryItem
      definition={definition}
      request={request}
      renderSummary={({ CrisprScreenSummary }) => {
        const { count } = CrisprScreenSummary;
        return `${count} ${count === 1 ? 'entry' : 'entries'}`;
      }}
      subText={dataTypesMap.affected_pathway}
    />
  );
}

Summary.fragments = {
  CrisprScreenSummary: CRISPR_SUMMARY,
};

export default Summary;
