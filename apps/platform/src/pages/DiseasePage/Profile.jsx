import { gql } from '@apollo/client';
import { PlatformApiProvider, SummaryContainer, SectionContainer } from 'ui';

import OntologySection from 'sections/src/disease/Ontology/Body';
import KnownDrugsSection from 'sections/src/disease/KnownDrugs/Body';
import BibliographySection from 'sections/src/disease/Bibliography/Body';
import PhenotypesSection from 'sections/src/disease/Phenotypes/Body';
import BibliographySummary from 'sections/src/disease/Bibliography/Summary';

import { createSummaryFragment } from '../../components/Summary/utils';
import client from '../../client';
import ProfileHeader from './ProfileHeader';
// import SectionContainer from '../../components/Section/SectionContainer';
import SectionOrderProvider from '../../contexts/SectionOrderProvider';
// import SummaryContainer from '../../components/Summary/SummaryContainer';

import sections from './sections';
import PrivateWrapper from '../../components/PrivateWrapper';

const DISEASE_PROFILE_SUMMARY_FRAGMENT = createSummaryFragment(
  sections,
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
      entity="disease"
      query={DISEASE_PROFILE_QUERY}
      variables={{ efoId }}
      client={client}
    >
      {/* <SectionOrderProvider sections={sections}> */}
      <ProfileHeader />
      {/* <SummaryContainer>
        <BibliographySummary id={efoId} label={name} />
      </SummaryContainer> */}
      {/* </SectionOrderProvider> */}
      {/* </Summary.SummaryContainer>
        {sections.map(({ Summary, definition }) => (
          <Summary
            key={definition.id}
            id={efoId}
            label={name}
            definition={definition}
          /> */}
      <SectionContainer>
        <OntologySection id={efoId} label={name} />
        <KnownDrugsSection id={efoId} label={name} />
        <PhenotypesSection id={efoId} label={name} />
        <BibliographySection id={efoId} label={name} />
      </SectionContainer>
      {/* <SectionContainer>
        {sections.map(({ Body, definition }) => (
          <Body
            key={definition.id}
            id={efoId}
            label={name}
            definition={definition}
          />
        ))}
      </SectionContainer> */}
    </PlatformApiProvider>
  );
}

export default Profile;
