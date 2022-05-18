import React from 'react';

import SummaryItem from '../../../components/Summary/SummaryItem';
import usePlatformApi from '../../../hooks/usePlatformApi';
import { dataTypesMap } from '../../../dataTypes';

import SYSBIO_SUMMARY_FRAGMENT from './SysBioSummaryFragment.gql';

function Summary({ definition }) {
  const request = usePlatformApi(SYSBIO_SUMMARY_FRAGMENT);

  return (
    <SummaryItem
      definition={definition}
      request={request}
      renderSummary={data =>
        `${data.sysBio.count} entr${data.sysBio.count === 1 ? 'y' : 'ies'}`
      }
      subText={dataTypesMap.affected_pathway}
    />
  );
}

Summary.fragments = {
  SysBioSummaryFragment: SYSBIO_SUMMARY_FRAGMENT,
};

export default Summary;
