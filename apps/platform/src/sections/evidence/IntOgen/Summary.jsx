import SummaryItem from '../../../components/Summary/SummaryItem';
import usePlatformApi from '../../../hooks/usePlatformApi';
import { dataTypesMap } from '../../../dataTypes';

import INTOGEN_SUMMARY_FRAGMENT from './IntOgenSummaryQuery.gql';

function Summary({ definition }) {
  const request = usePlatformApi(INTOGEN_SUMMARY_FRAGMENT);

  return (
    <SummaryItem
      definition={definition}
      request={request}
      renderSummary={data =>
        `${data.intOgen.count} entr${data.intOgen.count === 1 ? 'y' : 'ies'}`
      }
      subText={dataTypesMap.somatic_mutation}
    />
  );
}

Summary.fragments = {
  IntOgenSummaryFragment: INTOGEN_SUMMARY_FRAGMENT,
};

export default Summary;
