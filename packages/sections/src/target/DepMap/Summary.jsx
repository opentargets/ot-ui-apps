import _ from 'lodash';

import usePlatformApi from '../../../hooks/usePlatformApi';
import SummaryItem from '../../../components/Summary/SummaryItem';

import DEPMAP_SUMMARY_FRAGMENT from './DepmapSummaryFragment.gql';

function Summary({ definition }) {
  const request = usePlatformApi(DEPMAP_SUMMARY_FRAGMENT);

  return (
    <SummaryItem
      definition={definition}
      request={request}
      renderSummary={data => {
        return (
          <>
            {data.depMapEssentiality?.length} tissues
          </>
        );
      }}
    />
  );
}

Summary.fragments = {
  DepmapSummaryFragment: DEPMAP_SUMMARY_FRAGMENT,
};

export default Summary;
