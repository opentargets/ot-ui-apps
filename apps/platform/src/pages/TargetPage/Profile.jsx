import { gql } from '@apollo/client';
import { PlatformApiProvider, SectionContainer, SummaryContainer } from 'ui';

import KnownDrugsSummary from 'sections/src/target/KnownDrugs/Summary';
import TractabilitySummary from 'sections/src/target/Tractability/Summary';
import SafetySummary from 'sections/src/target/Safety/Summary';
import ChemicalProbesSummary from 'sections/src/target/ChemicalProbes/Summary';
import BaselineExpressionSummary from 'sections/src/target/Expression/Summary';
import DepMapSummary from 'sections/src/target/DepMap/Summary';
import GeneOntologySummary from 'sections/src/target/GeneOntology/Summary';
import GeneticConstraintSummary from 'sections/src/target/GeneticConstraint/Summary';
import ProtVistaSummary from 'sections/src/target/ProtVista/Summary';
import MolecularInteractionsSummary from 'sections/src/target/MolecularInteractions/Summary';
import PathwaysSummary from 'sections/src/target/Pathways/Summary';
import CancerHallmarksSummary from 'sections/src/target/CancerHallmarks/Summary';
import MousePhenotypesSummary from 'sections/src/target/MousePhenotypes/Summary';
import ComparativeGenomicsSummary from 'sections/src/target/ComparativeGenomics/Summary';
import SubcellularLocationSummary from 'sections/src/target/SubcellularLocation/Summary';
import BibliographySummary from 'sections/src/target/Bibliography/Summary';

import KnownDrugsSection from 'sections/src/target/KnownDrugs/Body';
import TractabilitySection from 'sections/src/target/Tractability/Body';
import SafetySection from 'sections/src/target/Safety/Body';
import ChemicalProbesSection from 'sections/src/target/ChemicalProbes/Body';
import BaselineExpressionSection from 'sections/src/target/Expression/Body';
import DepMapSection from 'sections/src/target/DepMap/Body';
import GeneOntologySection from 'sections/src/target/GeneOntology/Body';
import GeneticConstraintSection from 'sections/src/target/GeneticConstraint/Body';
import ProtVistaSection from 'sections/src/target/ProtVista/Body';
import MolecularInteractionsSection from 'sections/src/target/MolecularInteractions/Body';
import PathwaysSection from 'sections/src/target/Pathways/Body';
import CancerHallmarksSection from 'sections/src/target/CancerHallmarks/Body';
import MousePhenotypesSection from 'sections/src/target/MousePhenotypes/Body';
import ComparativeGenomicsSection from 'sections/src/target/ComparativeGenomics/Body';
import SubcellularLocationSection from 'sections/src/target/SubcellularLocation/Body';
import BibliographySection from 'sections/src/target/Bibliography/Body';
import ProfileHeader from './ProfileHeader';
import { createSummaryFragment } from '../../components/Summary/utils';

import sections from './sections';
import client from '../../client';

const TARGET = 'target';
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
      entity={TARGET}
      query={TARGET_PROFILE_QUERY}
      variables={{ ensgId }}
      client={client}
    >
      <ProfileHeader />
      <SummaryContainer>
        <KnownDrugsSummary />
        <TractabilitySummary />
        <SafetySummary />
        <ChemicalProbesSummary />
        <BaselineExpressionSummary />
        <DepMapSummary />
        <SubcellularLocationSummary />
        <GeneOntologySummary />
        <GeneticConstraintSummary />
        <ProtVistaSummary />
        <MolecularInteractionsSummary />
        <PathwaysSummary />
        {/* <CancerHallmarksSummary /> */}
        <MousePhenotypesSummary />
        <ComparativeGenomicsSummary />
        <BibliographySummary />
      </SummaryContainer>

      <SectionContainer>
        <KnownDrugsSection id={ensgId} label={symbol} entity={TARGET}/>
        <TractabilitySection id={ensgId} label={symbol} entity={TARGET}/>
        <SafetySection id={ensgId} label={symbol} entity={TARGET}/>
        <ChemicalProbesSection id={ensgId} label={symbol} entity={TARGET} />
        <BaselineExpressionSection id={ensgId} label={symbol} entity={TARGET} />
        <DepMapSection id={ensgId} label={symbol} entity={TARGET} />
        <SubcellularLocationSection id={ensgId} label={symbol} entity={TARGET} />
        <GeneOntologySection id={ensgId} label={symbol} entity={TARGET} />
        <GeneticConstraintSection id={ensgId} label={symbol} entity={TARGET} />
        <ProtVistaSection id={ensgId} label={symbol} entity={TARGET} />
        <MolecularInteractionsSection id={ensgId} label={symbol} entity={TARGET} />
        <PathwaysSection id={ensgId} label={symbol} entity={TARGET} />
        {/* <CancerHallmarksSection id={ensgId} label={symbol} entity={TARGET} /> */}
        <MousePhenotypesSection id={ensgId} label={symbol} entity={TARGET} />
        <ComparativeGenomicsSection id={ensgId} label={symbol} entity={TARGET} />
        <BibliographySection id={ensgId} label={symbol} entity={TARGET} />
      </SectionContainer>
    </PlatformApiProvider>
  );
}

export default Profile;
