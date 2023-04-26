import usePlatformApi from '../../../hooks/usePlatformApi';
import SummaryItem from '../../../components/Summary/SummaryItem';
// import { dataTypesMap } from '../../../dataTypes';

import CANCER_BIOMARKERS_EVIDENCE_FRAGMENT from './CancerBiomarkersEvidenceFragment.gql';

function Summary({ definition }) {
  const request = usePlatformApi(CANCER_BIOMARKERS_EVIDENCE_FRAGMENT);

  return (
    <SummaryItem
      definition={definition}
      request={request}
      renderSummary={({ cancerBiomarkersSummary }) => {
        const { count } = cancerBiomarkersSummary;
        return `${count} ${count === 1 ? 'entry' : 'entries'}`;
      }}
      subText={definition.dataType}
    />
  );
}

Summary.fragments = {
  CancerBiomarkersEvidenceFragment: CANCER_BIOMARKERS_EVIDENCE_FRAGMENT,
};

export default Summary;
