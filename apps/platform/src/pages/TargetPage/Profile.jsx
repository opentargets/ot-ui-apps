import { gql } from '@apollo/client';
import { PlatformApiProvider, SectionContainer } from 'ui';

import ProfileHeader from './ProfileHeader';
import KnownDrugsSection from 'sections/src/target/KnownDrugs/Body';
import TractabilitySection from 'sections/src/target/Tractability/Body';
import SafetySection from 'sections/src/target/Safety/Body';
import ChemicalProbesSection from 'sections/src/target/ChemicalProbes/Body';
import BaselineExpressionSection from 'sections/src/target/Expression/Body';
import DepMapSection from 'sections/src/target/DepMap/Body';
import GeneOntologySection from 'sections/src/target/GeneOntology/Body';
import GeneticConstraintSection from 'sections/src/target/GeneticConstraint/Body';
import ProtVistaSection from 'sections/src/target/ProtVista/Body';



import { createSummaryFragment } from '../../components/Summary/utils';

import sections from './sections';
import client from '../../client';

const TARGET_PROFILE_SUMMARY_FRAGMENT = createSummaryFragment(
  sections,
  'Target'
);
const TARGET_PROFILE_QUERY = gql`
  query TargetProfileQuery($ensgId: String!) {
    target(ensemblId: $ensgId) {
      id
      ...TargetProfileHeaderFragment
      ...TargetProfileSummaryFragment
    }
  }
  ${ProfileHeader.fragments.profileHeader}
  ${TARGET_PROFILE_SUMMARY_FRAGMENT}
`;

function Profile({ ensgId, symbol }) {
  return (
    <PlatformApiProvider
      entity="target"
      query={TARGET_PROFILE_QUERY}
      variables={{ ensgId }}
      client={client}
    >
      <ProfileHeader />

      <SectionContainer>
        <KnownDrugsSection id={ensgId} label={symbol} />
        <TractabilitySection id={ensgId} label={symbol} />
        <SafetySection id={ensgId} label={symbol} />
        <ChemicalProbesSection id={ensgId} label={symbol} />
        <BaselineExpressionSection id={ensgId} label={symbol} />
        <DepMapSection id={ensgId} label={symbol} />
        <GeneOntologySection id={ensgId} label={symbol} />
        <GeneticConstraintSection id={ensgId} label={symbol} />
        <ProtVistaSection id={ensgId} label={symbol} />



      </SectionContainer>
    </PlatformApiProvider>
  );
}

export default Profile;
