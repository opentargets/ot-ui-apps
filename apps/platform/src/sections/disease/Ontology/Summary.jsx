import React from 'react';

import SummaryItem from '../../../components/Summary/SummaryItem';
import usePlatformApi from '../../../hooks/usePlatformApi';

import ONTOLOGY_SUMMARY_FRAGMENT from './OntologySummaryFragment.gql';

function Summary({ definition }) {
  const request = usePlatformApi(ONTOLOGY_SUMMARY_FRAGMENT);

  return (
    <SummaryItem
      definition={definition}
      request={request}
      renderSummary={data =>
        data.isTherapeuticArea
          ? 'Therapeutic area'
          : `Belongs to ${data.therapeuticAreas.length} therapeutic areas`
      }
    />
  );
}

Summary.fragments = {
  OntologySummaryFragment: ONTOLOGY_SUMMARY_FRAGMENT,
};

export default Summary;
