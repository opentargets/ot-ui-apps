import { SummaryItem, usePlatformApi } from 'ui';

import { definition } from '.';
import { dataTypesMap } from '../../dataTypes';
import PROGENY_SUMMARY_FRAGMENT from './ProgenySummaryFragment.gql';

function Summary() {
  const request = usePlatformApi(PROGENY_SUMMARY_FRAGMENT);

  return (
    <SummaryItem
      definition={definition}
      request={request}
      renderSummary={data =>
        `${data.progeny.count} entr${data.progeny.count === 1 ? 'y' : 'ies'}`
      }
      subText={dataTypesMap.affected_pathway}
    />
  );
}

Summary.fragments = {
  ProgenySummaryFragment: PROGENY_SUMMARY_FRAGMENT,
};

export default Summary;
