import React from 'react';
import usePlatformApi from '../../../hooks/usePlatformApi';
import SummaryItem from '../../../components/Summary/SummaryItem';
import { dataTypesMap } from '../../../dataTypes';

import CHEMBL_SUMMARY_FRAGMENT from './ChemblSummaryFragment.gql';

function Summary({ definition }) {
  const request = usePlatformApi(CHEMBL_SUMMARY_FRAGMENT);

  return (
    <SummaryItem
      definition={definition}
      request={request}
      renderSummary={({ chemblSummary }) => {
        const { count } = chemblSummary;
        return `${count} ${count === 1 ? 'entry' : 'entries'}`;
      }}
      subText={dataTypesMap.known_drug}
    />
  );
}

Summary.fragments = {
  ChemblSummaryFragment: CHEMBL_SUMMARY_FRAGMENT,
};

export default Summary;
