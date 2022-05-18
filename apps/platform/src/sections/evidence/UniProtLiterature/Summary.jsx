import React from 'react';
import usePlatformApi from '../../../hooks/usePlatformApi';
import SummaryItem from '../../../components/Summary/SummaryItem';
import { dataTypesMap } from '../../../dataTypes';

import UNIPROT_LITERATURE_SUMMARY from './UniprotLiteratureSummary.gql';

function Summary({ definition }) {
  const request = usePlatformApi(UNIPROT_LITERATURE_SUMMARY);
  return (
    <SummaryItem
      definition={definition}
      request={request}
      renderSummary={({ uniprotLiteratureSummary }) => {
        const { count } = uniprotLiteratureSummary;
        return `${count} ${count === 1 ? 'entry' : 'entries'}`;
      }}
      subText={dataTypesMap.genetic_association}
    />
  );
}

Summary.fragments = {
  UniprotLiteratureSummary: UNIPROT_LITERATURE_SUMMARY,
};

export default Summary;
