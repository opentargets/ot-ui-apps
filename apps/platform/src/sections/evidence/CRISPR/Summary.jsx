import React from 'react';
import usePlatformApi from '../../../hooks/usePlatformApi';
import SummaryItem from '../../../components/Summary/SummaryItem';
import { dataTypesMap } from '../../../dataTypes';

import CRISPR_SUMMARY from './CrisprSummary.gql';

function Summary({ definition }) {
  const request = usePlatformApi(CRISPR_SUMMARY);
  return (
    <SummaryItem
      definition={definition}
      request={request}
      renderSummary={({ crisprSummary }) => {
        const { count } = crisprSummary;
        return `${count} ${count === 1 ? 'entry' : 'entries'}`;
      }}
      subText={dataTypesMap.affected_pathway}
    />
  );
}

Summary.fragments = {
  crisprSummary: CRISPR_SUMMARY,
};

export default Summary;
