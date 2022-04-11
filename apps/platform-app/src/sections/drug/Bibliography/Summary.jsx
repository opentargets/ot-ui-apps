import React from 'react';

import SummaryItem from '../../../components/Summary/SummaryItem';
import usePlatformApi from '../../../hooks/usePlatformApi';

import SIMILARENTTIES_SUMMARY_FRAGMENT from './BibliographySummaryFragment.gql';

function Summary({ definition }) {
  const request = usePlatformApi(SIMILARENTTIES_SUMMARY_FRAGMENT);

  return (
    <SummaryItem
      definition={definition}
      request={request}
      renderSummary={data =>
        data.literatureOcurrences?.count > 0 ? (
          <>
            {data.literatureOcurrences.count.toLocaleString()} publication
            {data.literatureOcurrences.count === 1 ? '' : 's'}
          </>
        ) : (
          <>no data</>
        )
      }
    />
  );
}

Summary.fragments = {
  DrugBibliography: SIMILARENTTIES_SUMMARY_FRAGMENT,
};

export default Summary;
