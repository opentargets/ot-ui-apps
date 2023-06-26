import { gql } from '@apollo/client';
import { PlatformApiProvider, SectionContainer } from 'ui';

import OntologySection from 'sections/src/disease/Ontology/Body';
import KnownDrugsSection from 'sections/src/disease/KnownDrugs/Body';
import BibliographySection from 'sections/src/disease/Bibliography/Body';
import PhenotypesSection from 'sections/src/disease/Phenotypes/Body';
import OTProjectsSection from 'sections/src/disease/OTProjects/Body';

import { createSummaryFragment } from '../../components/Summary/utils';
import client from '../../client';
import ProfileHeader from './ProfileHeader';

import PrivateWrapper from '../../components/PrivateWrapper';

const DISEASE_PROFILE_SUMMARY_FRAGMENT = createSummaryFragment([], 'Disease');
const DISEASE_PROFILE_QUERY = gql`
  query DiseaseProfileQuery($efoId: String!) {
    disease(efoId: $efoId) {
      id
      ...DiseaseProfileHeaderFragment
      ...DiseaseProfileSummaryFragment
    }
  }
  ${ProfileHeader.fragments.profileHeader}
  ${DISEASE_PROFILE_SUMMARY_FRAGMENT}
`;

function Profile({ efoId, name }) {
  return (
    <PlatformApiProvider
      entity="disease"
      query={DISEASE_PROFILE_QUERY}
      variables={{ efoId }}
      client={client}
    >
      <ProfileHeader />
      {/* <SummaryContainer>
        <BibliographySummary id={efoId} label={name} />
      </SummaryContainer> */}

      <SectionContainer>
        <OntologySection id={efoId} label={name} />
        <KnownDrugsSection id={efoId} label={name} />
        <PhenotypesSection id={efoId} label={name} />
        <BibliographySection id={efoId} label={name} />
        <PrivateWrapper>
          <OTProjectsSection id={efoId} label={name} />
        </PrivateWrapper>
      </SectionContainer>
    </PlatformApiProvider>
  );
}

export default Profile;
