import { gql } from '@apollo/client';
import { SectionContainer } from 'ui';

import { createSummaryFragment } from '../../components/Summary/utils';
import PlatformApiProvider from '../../contexts/PlatformApiProvider';
import ProfileHeader from './ProfileHeader';

import CancerBiomarkersSection from 'sections/src/evidence/CancerBiomarkers/Body';
import CancerGeneCensusSection from 'sections/src/evidence/CancerGeneCensus/Body';
import ChemblSection from 'sections/src/evidence/Chembl/Body';
import ClinGenSection from 'sections/src/evidence/ClinGen/Body';
import CRISPRSection from 'sections/src/evidence/CRISPR/Body';
import CrisprScreenSection from 'sections/src/evidence/CRISPRScreen/Body';
import EuropePmcSection from 'sections/src/evidence/EuropePmc/Body';
import EVASection from 'sections/src/evidence/EVA/Body';
import EVASomaticSection from 'sections/src/evidence/EVASomatic/Body';
import ExpressionAtlasSection from 'sections/src/evidence/ExpressionAtlas/Body';
import Gene2PhenotypeSection from 'sections/src/evidence/Gene2Phenotype/Body';
import GenomicsEnglandSection from 'sections/src/evidence/GenomicsEngland/Body';


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
  const id = { ensgId, efoId };
  const label = { symbol, name };

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
        <CancerBiomarkersSection id={id} label={label} />
        <CancerGeneCensusSection id={id} label={label} />
        <ChemblSection id={id} label={label} />
        <ClinGenSection id={id} label={label} />
        <CRISPRSection id={id} label={label} />
        <CrisprScreenSection id={id} label={label} />
        <EuropePmcSection id={id} label={label} />
        <EVASection id={id} label={label} />
        <EVASomaticSection id={id} label={label} />
        <ExpressionAtlasSection id={id} label={label} />
        <Gene2PhenotypeSection id={id} label={label} />
        <GenomicsEnglandSection id={id} label={label} />

      </SectionContainer>
      {/* </SectionOrderProvider> */}
    </PlatformApiProvider>
  );
}

export default Profile;
