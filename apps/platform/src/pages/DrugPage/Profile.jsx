import { gql } from '@apollo/client';
import { PlatformApiProvider, SectionContainer, SummaryContainer } from 'ui';

import MechanismsOfActionSummary from 'sections/src/drug/MechanismsOfAction/Summary';
import IndicationsSummary from 'sections/src/drug/Indications/Summary';
import KnownDrugsSummary from 'sections/src/drug/KnownDrugs/Summary';
import DrugWarningsSummary from 'sections/src/drug/DrugWarnings/Summary';
import AdverseEventsSummary from 'sections/src/drug/AdverseEvents/Summary';
import BibliographySummary from 'sections/src/drug/Bibliography/Summary';

import MechanismsOfActionSection from 'sections/src/drug/MechanismsOfAction/Body';
import IndicationsSection from 'sections/src/drug/Indications/Body';
import KnownDrugsSection from 'sections/src/drug/KnownDrugs/Body';
import DrugWarningsSection from 'sections/src/drug/DrugWarnings/Body';
import AdverseEventsSection from 'sections/src/drug/AdverseEvents/Body';
import BibliographySection from 'sections/src/drug/Bibliography/Body';

import client from '../../client';
import sections from './sections';
import ProfileHeader from './ProfileHeader';
import { createSummaryFragment } from '../../components/Summary/utils';

const DRUG_PROFILE_SUMMARY_FRAGMENT = createSummaryFragment(sections, 'Drug');
const DRUG_PROFILE_QUERY = gql`
  query DrugProfileQuery($chemblId: String!) {
    drug(chemblId: $chemblId) {
      id
      ...DrugProfileHeaderFragment
      ...DrugProfileSummaryFragment
    }
  }
  ${ProfileHeader.fragments.profileHeader}
  ${DRUG_PROFILE_SUMMARY_FRAGMENT}
`;

function Profile({ chemblId, name }) {
  return (
    <PlatformApiProvider
      entity="drug"
      query={DRUG_PROFILE_QUERY}
      variables={{ chemblId }}
      client={client}
    >
      <ProfileHeader chemblId={chemblId} />

      <SummaryContainer>
        <MechanismsOfActionSummary />
        <IndicationsSummary />
        <KnownDrugsSummary />
        <DrugWarningsSummary />
        <AdverseEventsSummary />
        <BibliographySummary />
      </SummaryContainer>

      <SectionContainer>
        <MechanismsOfActionSection id={chemblId} label={name} />
        <IndicationsSection id={chemblId} label={name} />
        <KnownDrugsSection id={chemblId} label={name} />
        <DrugWarningsSection id={chemblId} label={name} />
        <AdverseEventsSection id={chemblId} label={name} />
        <BibliographySection id={chemblId} label={name} />
      </SectionContainer>
    </PlatformApiProvider>
  );
}

export default Profile;
