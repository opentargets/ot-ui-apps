import SummaryItem from '../../../components/Summary/SummaryItem';
import usePlatformApi from '../../../hooks/usePlatformApi';

import MOUSE_PHENOTYPES_SUMMARY_FRAGMENT from './MousePhenotypesSummary.gql';

function Summary({ definition }) {
  const request = usePlatformApi(MOUSE_PHENOTYPES_SUMMARY_FRAGMENT);

  return (
    <SummaryItem
      definition={definition}
      request={request}
      renderSummary={({ mousePhenotypes }) =>
        `${mousePhenotypes.length} distinct phenotype${
          mousePhenotypes.length > 1 ? 's' : ''
        }`
      }
    />
  );
}

Summary.fragments = {
  MousePhenotypesSummaryFragment: MOUSE_PHENOTYPES_SUMMARY_FRAGMENT,
};

export default Summary;
