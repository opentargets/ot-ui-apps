import { gql } from '@apollo/client';
import { Suspense, lazy } from 'react';
import {
  PlatformApiProvider,
  SectionContainer,
  SummaryContainer,
  summaryUtils,
  PrivateWrapper,
} from 'ui';

import CancerBiomarkersSummary from 'sections/src/evidence/CancerBiomarkers/Summary';
import CancerGeneCensusSummary from 'sections/src/evidence/CancerGeneCensus/Summary';
import ChemblSummary from 'sections/src/evidence/Chembl/Summary';
import ClinGenSummary from 'sections/src/evidence/ClinGen/Summary';
import CRISPRSummary from 'sections/src/evidence/CRISPR/Summary';
import CrisprScreenSummary from 'sections/src/evidence/CRISPRScreen/Summary';
import EuropePmcSummary from 'sections/src/evidence/EuropePmc/Summary';
import EVASummary from 'sections/src/evidence/EVA/Summary';
import EVASomaticSummary from 'sections/src/evidence/EVASomatic/Summary';
import ExpressionAtlasSummary from 'sections/src/evidence/ExpressionAtlas/Summary';
import Gene2PhenotypeSummary from 'sections/src/evidence/Gene2Phenotype/Summary';
import GenomicsEnglandSummary from 'sections/src/evidence/GenomicsEngland/Summary';
import ImpcSummary from 'sections/src/evidence/Impc/Summary';
import IntOgenSummary from 'sections/src/evidence/IntOgen/Summary';
import GeneBurdenSummary from 'sections/src/evidence/GeneBurden/Summary';
import OrphanetSummary from 'sections/src/evidence/Orphanet/Summary';
import OTCRISPRSummary from 'sections/src/evidence/OTCRISPR/Summary';
import OTEncoreSummary from 'sections/src/evidence/OTEncore/Summary';
import OTGeneticsSummary from 'sections/src/evidence/OTGenetics/Summary';
import OTValidationSummary from 'sections/src/evidence/OTValidation/Summary';
import ProgenySummary from 'sections/src/evidence/Progeny/Summary';
import ReactomeSummary from 'sections/src/evidence/Reactome/Summary';
import SlapEnrichSummary from 'sections/src/evidence/SlapEnrich/Summary';
import SysBioSummary from 'sections/src/evidence/SysBio/Summary';
import UniProtLiteratureSummary from 'sections/src/evidence/UniProtLiterature/Summary';
import UniProtVariantsSummary from 'sections/src/evidence/UniProtVariants/Summary';

const CancerBiomarkersSection = lazy(() =>
  import('sections/src/evidence/CancerBiomarkers/Body')
);
const CancerGeneCensusSection = lazy(() =>
  import('sections/src/evidence/CancerGeneCensus/Body')
);
const ChemblSection = lazy(() => import('sections/src/evidence/Chembl/Body'));
const ClinGenSection = lazy(() => import('sections/src/evidence/ClinGen/Body'));
const CRISPRSection = lazy(() => import('sections/src/evidence/CRISPR/Body'));
const CrisprScreenSection = lazy(() =>
  import('sections/src/evidence/CRISPRScreen/Body')
);
const EuropePmcSection = lazy(() =>
  import('sections/src/evidence/EuropePmc/Body')
);
const EVASection = lazy(() => import('sections/src/evidence/EVA/Body'));
const EVASomaticSection = lazy(() =>
  import('sections/src/evidence/EVASomatic/Body')
);
const ExpressionAtlasSection = lazy(() =>
  import('sections/src/evidence/ExpressionAtlas/Body')
);
const Gene2PhenotypeSection = lazy(() =>
  import('sections/src/evidence/Gene2Phenotype/Body')
);
const GenomicsEnglandSection = lazy(() =>
  import('sections/src/evidence/GenomicsEngland/Body')
);
const ImpcSection = lazy(() => import('sections/src/evidence/Impc/Body'));
const IntOgenSection = lazy(() => import('sections/src/evidence/IntOgen/Body'));
const GeneBurdenSection = lazy(() =>
  import('sections/src/evidence/GeneBurden/Body')
);
const OrphanetSection = lazy(() =>
  import('sections/src/evidence/Orphanet/Body')
);
const OTCRISPRSection = lazy(() =>
  import('sections/src/evidence/OTCRISPR/Body')
);
const OTEncoreSection = lazy(() =>
  import('sections/src/evidence/OTEncore/Body')
);
const OTGeneticsSection = lazy(() =>
  import('sections/src/evidence/OTGenetics/Body')
);
const OTValidationSection = lazy(() =>
  import('sections/src/evidence/OTValidation/Body')
);
const ProgenySection = lazy(() => import('sections/src/evidence/Progeny/Body'));
const ReactomeSection = lazy(() =>
  import('sections/src/evidence/Reactome/Body')
);
const SlapEnrichSection = lazy(() =>
  import('sections/src/evidence/SlapEnrich/Body')
);
const SysBioSection = lazy(() => import('sections/src/evidence/SysBio/Body'));
const UniProtLiteratureSection = lazy(() =>
  import('sections/src/evidence/UniProtLiterature/Body')
);
const UniProtVariantsSection = lazy(() =>
  import('sections/src/evidence/UniProtVariants/Body')
);

import ProfileHeader from './ProfileHeader';

const summaries = [
  CancerBiomarkersSummary,
  CancerGeneCensusSummary,
  ChemblSummary,
  ClinGenSummary,
  CRISPRSummary,
  CrisprScreenSummary,
  EuropePmcSummary,
  EVASummary,
  EVASomaticSummary,
  ExpressionAtlasSummary,
  Gene2PhenotypeSummary,
  GenomicsEnglandSummary,
  ImpcSummary,
  IntOgenSummary,
  GeneBurdenSummary,
  OrphanetSummary,
  OTCRISPRSummary,
  OTEncoreSummary,
  OTGeneticsSummary,
  OTValidationSummary,
  ProgenySummary,
  ReactomeSummary,
  SlapEnrichSummary,
  SysBioSummary,
  UniProtLiteratureSummary,
  UniProtVariantsSummary,
];

const EVIDENCE = 'evidence';
const DISEASE = 'disease';

const EVIDENCE_PROFILE_SUMMARY_FRAGMENT = summaryUtils.createSummaryFragment(
  summaries,
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
      lsSectionsField={EVIDENCE}
      entity={DISEASE}
      query={EVIDENCE_PROFILE_QUERY}
      variables={{ ensgId, efoId }}
    >
      <ProfileHeader />

      <SummaryContainer>
        <OTGeneticsSummary />
        <EVASummary />
        <GeneBurdenSummary />
        <GenomicsEnglandSummary />
        <Gene2PhenotypeSummary />
        <UniProtLiteratureSummary />
        <UniProtVariantsSummary />
        <ClinGenSummary />
        <OrphanetSummary />
        <CancerGeneCensusSummary />
        <IntOgenSummary />
        <EVASomaticSummary />
        <ChemblSummary />
        <CRISPRSummary />
        <CrisprScreenSummary />
        <CancerBiomarkersSummary />
        <SlapEnrichSummary />
        <ProgenySummary />
        <ReactomeSummary />
        <SysBioSummary />
        <EuropePmcSummary />
        <ExpressionAtlasSummary />
        <ImpcSummary />
        <PrivateWrapper>
          <OTCRISPRSummary />
          <OTEncoreSummary />
          <OTValidationSummary />
        </PrivateWrapper>
      </SummaryContainer>

      <SectionContainer>
        <Suspense fallback={'Loading ...'}>
          <OTGeneticsSection id={id} label={label} entity={DISEASE} />
          <EVASection id={id} label={label} entity={DISEASE} />
          <GeneBurdenSection id={id} label={label} entity={DISEASE} />
          <GenomicsEnglandSection id={id} label={label} entity={DISEASE} />
          <Gene2PhenotypeSection id={id} label={label} entity={DISEASE} />
          <UniProtLiteratureSection id={id} label={label} entity={DISEASE} />
          <UniProtVariantsSection id={id} label={label} entity={DISEASE} />
          <ClinGenSection id={id} label={label} entity={DISEASE} />
          <OrphanetSection id={id} label={label} entity={DISEASE} />
          <CancerGeneCensusSection id={id} label={label} entity={DISEASE} />
          <IntOgenSection id={id} label={label} entity={DISEASE} />
          <EVASomaticSection id={id} label={label} entity={DISEASE} />
          <ChemblSection id={id} label={label} entity={DISEASE} />
          <CRISPRSection id={id} label={label} entity={DISEASE} />
          <CrisprScreenSection id={id} label={label} entity={DISEASE} />
          <CancerBiomarkersSection id={id} label={label} entity={DISEASE} />
          <SlapEnrichSection id={id} label={label} entity={DISEASE} />
          <ProgenySection id={id} label={label} entity={DISEASE} />
          <ReactomeSection id={id} label={label} entity={DISEASE} />
          <SysBioSection id={id} label={label} entity={DISEASE} />
          <EuropePmcSection id={id} label={label} entity={DISEASE} />
          <ExpressionAtlasSection id={id} label={label} entity={DISEASE} />
          <ImpcSection id={id} label={label} entity={DISEASE} />
          <PrivateWrapper>
            <OTCRISPRSection id={id} label={label} entity={DISEASE} />
            <OTEncoreSection id={id} label={label} entity={DISEASE} />
            <OTValidationSection id={id} label={label} entity={DISEASE} />
          </PrivateWrapper>
        </Suspense>
      </SectionContainer>
    </PlatformApiProvider>
  );
}

export default Profile;
