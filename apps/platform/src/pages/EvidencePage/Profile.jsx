import { gql } from '@apollo/client';
import { SectionContainer } from 'ui';

import { createSummaryFragment } from '../../components/Summary/utils';
import PlatformApiProvider from '../../contexts/PlatformApiProvider';
import ProfileHeader from './ProfileHeader';
import CancerBiomarkersSection from 'sections/src/evidence/CancerBiomarkers/Body';
import CancerGeneCensusSection from 'sections/src/evidence/CancerGeneCensus/Body';

import SectionOrderProvider from '../../contexts/SectionOrderProvider';
// import SummaryContainer from '../../components/Summary/SummaryContainer';

import sections from './sections';

const EVIDENCE_PROFILE_SUMMARY_FRAGMENT = createSummaryFragment(
  sections,
  'Disease',
  'EvidenceProfileSummaryFragment'
);

const EVIDENCE_PROFILE_QUERY = gql`
  query EvidenceProfileQuery($ensgId: String!, $efoId: String!) {
    target(ensemblId: $ensgId) {
      id
      approvedSymbol
      approvedName
      functionDescriptions
      synonyms {
        label
        source
      }
    }
    disease(efoId: $efoId) {
      id
      name
      description
      synonyms {
        terms
        relation
      }
      ...EvidenceProfileSummaryFragment
    }
  }
  ${EVIDENCE_PROFILE_SUMMARY_FRAGMENT}
`;

function Profile({ ensgId, efoId, symbol, name }) {
  return (
    <PlatformApiProvider
      lsSectionsField="evidence"
      entity="disease"
      query={EVIDENCE_PROFILE_QUERY}
      variables={{ ensgId, efoId }}
    >
      {/* <SectionOrderProvider sections={sections}> */}
      <ProfileHeader />

      <SectionContainer>
        <CancerBiomarkersSection
          id={{ ensgId, efoId }}
          label={{ symbol, name }}
        />
        <CancerGeneCensusSection
          id={{ ensgId, efoId }}
          label={{ symbol, name }}
        />
      </SectionContainer>
      {/* </SectionOrderProvider> */}
    </PlatformApiProvider>
  );
}

export default Profile;
