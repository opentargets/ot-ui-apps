import { gql } from '@apollo/client';
import { PlatformApiProvider, SectionContainer } from 'ui';

import client from '../../client';
import sections from './sections';
import ProfileHeader from './ProfileHeader';
import { createSummaryFragment } from '../../components/Summary/utils';

import MechanismsOfActionSection from 'sections/src/drug/MechanismsOfAction/Body';
import IndicationsSection from 'sections/src/drug/Indications/Body';
import KnownDrugsSection from 'sections/src/drug/KnownDrugs/Body';
import DrugWarningsSection from 'sections/src/drug/DrugWarnings/Body';



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

      <SectionContainer>
        <MechanismsOfActionSection id={chemblId} label={name}/>
        <IndicationsSection id={chemblId} label={name}/>
        <KnownDrugsSection id={chemblId} label={name}/>
        <DrugWarningsSection id={chemblId} label={name}/>


        
      </SectionContainer>
    </PlatformApiProvider>
  );
}

export default Profile;
