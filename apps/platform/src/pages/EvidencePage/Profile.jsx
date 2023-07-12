import { gql } from '@apollo/client';
import { SectionContainer } from 'ui';

import sections from './sections';
import { createSummaryFragment } from '../../components/Summary/utils';
import PlatformApiProvider from '../../contexts/PlatformApiProvider';
import ProfileHeader from './ProfileHeader';
import PrivateWrapper from '../../components/PrivateWrapper';

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
import ImpcSection from 'sections/src/evidence/Impc/Body';
import IntOgenSection from 'sections/src/evidence/IntOgen/Body';
import GeneBurdenSection from 'sections/src/evidence/GeneBurden/Body';
import OrphanetSection from 'sections/src/evidence/Orphanet/Body';
import OTCRISPRSection from 'sections/src/evidence/OTCRISPR/Body';
import OTEncoreSection from 'sections/src/evidence/OTEncore/Body';
import OTGeneticsSection from 'sections/src/evidence/OTGenetics/Body';
import OTValidationSection from 'sections/src/evidence/OTValidation/Body';
import ProgenySection from 'sections/src/evidence/Progeny/Body';
import ReactomeSection from 'sections/src/evidence/Reactome/Body';
import SlapEnrichSection from 'sections/src/evidence/SlapEnrich/Body';
import SysBioSection from 'sections/src/evidence/SysBio/Body';
import UniProtLiteratureSection from 'sections/src/evidence/UniProtLiterature/Body';
import UniProtVariantsSection from 'sections/src/evidence/UniProtVariants/Body';



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
        <ImpcSection id={id} label={label} />
        <IntOgenSection id={id} label={label} />
        <GeneBurdenSection id={id} label={label} />
        <OrphanetSection id={id} label={label} />
        <PrivateWrapper>
          <OTCRISPRSection id={id} label={label} />
          <OTEncoreSection id={id} label={label} />
          <OTValidationSection id={id} label={label} />
        </PrivateWrapper>
        <OTGeneticsSection id={id} label={label} />
        <ProgenySection id={id} label={label} />
        <ReactomeSection id={id} label={label} />
        <SlapEnrichSection id={id} label={label} />
        <SysBioSection id={id} label={label} />
        <UniProtLiteratureSection id={id} label={label} />
        <UniProtVariantsSection id={id} label={label} />
      </SectionContainer>
    </PlatformApiProvider>
  );
}

export default Profile;
