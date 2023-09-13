import { gql } from '@apollo/client';
import {
  PlatformApiProvider,
  SectionContainer,
  SummaryContainer,
  summaryUtils,
  PrivateWrapper,
} from 'ui';

import OntologySummary from 'sections/src/disease/Ontology/Summary';
import KnownDrugsSummary from 'sections/src/disease/KnownDrugs/Summary';
import BibliographySummary from 'sections/src/disease/Bibliography/Summary';
import PhenotypesSummary from 'sections/src/disease/Phenotypes/Summary';
import OTProjectsSummary from 'sections/src/disease/OTProjects/Summary';

import OntologySection from 'sections/src/disease/Ontology/Body';
import KnownDrugsSection from 'sections/src/disease/KnownDrugs/Body';
import BibliographySection from 'sections/src/disease/Bibliography/Body';
import PhenotypesSection from 'sections/src/disease/Phenotypes/Body';
import OTProjectsSection from 'sections/src/disease/OTProjects/Body';

import client from '../../client';
import ProfileHeader from './ProfileHeader';

const summaries = [
  OntologySummary,
  KnownDrugsSummary,
  BibliographySummary,
  PhenotypesSummary,
  OTProjectsSummary,
];

const DISEASE = 'disease';
const DISEASE_PROFILE_SUMMARY_FRAGMENT = summaryUtils.createSummaryFragment(
  summaries,
  'Disease'
);
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
      entity={DISEASE}
      query={DISEASE_PROFILE_QUERY}
      variables={{ efoId }}
      client={client}
    >
      <ProfileHeader />
      <SummaryContainer>
        <OntologySummary />
        <KnownDrugsSummary />
        <PhenotypesSummary />
        <BibliographySummary />
        <PrivateWrapper>
          <OTProjectsSummary />
        </PrivateWrapper>
      </SummaryContainer>

      <SectionContainer>
        <OntologySection id={efoId} label={name} entity={DISEASE} />
        <KnownDrugsSection id={efoId} label={name} entity={DISEASE} />
        <PhenotypesSection id={efoId} label={name} entity={DISEASE} />
        <BibliographySection id={efoId} label={name} entity={DISEASE} />
        <PrivateWrapper>
          <OTProjectsSection id={efoId} label={name} entity={DISEASE} />
        </PrivateWrapper>
      </SectionContainer>
    </PlatformApiProvider>
  );
}

export default Profile;
