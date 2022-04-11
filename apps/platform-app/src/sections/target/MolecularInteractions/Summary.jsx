import React from 'react';
import SummaryItem from '../../../components/Summary/SummaryItem';
import usePlatformApi from '../../../hooks/usePlatformApi';

import MOLECULAR_INTERACTIONS_SUMMARY_FRAGMENT from './InteractionsSummary.gql';

function Summary({ definition }) {
  const request = usePlatformApi(MOLECULAR_INTERACTIONS_SUMMARY_FRAGMENT);

  return (
    <SummaryItem
      definition={definition}
      request={request}
      renderSummary={data =>
        `${data.interactions.count} physical or functional interactors`
      }
    />
  );
}

Summary.fragments = {
  TargetMolecularInteractionsSummaryFragment: MOLECULAR_INTERACTIONS_SUMMARY_FRAGMENT,
};

export default Summary;
