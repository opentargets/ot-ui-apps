import { gql } from "@apollo/client";
import { lazy, Suspense } from "react";
import {
  PlatformApiProvider,
  SectionContainer,
  SummaryContainer,
  summaryUtils,
  SectionLoader,
} from "ui";

import KnownDrugsSummary from "sections/src/target/KnownDrugs/Summary";
import TractabilitySummary from "sections/src/target/Tractability/Summary";
import SafetySummary from "sections/src/target/Safety/Summary";
import PharmacogenomicsSummary from "sections/src/target/Pharmacogenomics/Summary";
import ChemicalProbesSummary from "sections/src/target/ChemicalProbes/Summary";
import BaselineExpressionSummary from "sections/src/target/Expression/Summary";
import DepMapSummary from "sections/src/target/DepMap/Summary";
import GeneOntologySummary from "sections/src/target/GeneOntology/Summary";
import GeneticConstraintSummary from "sections/src/target/GeneticConstraint/Summary";
import ProtVistaSummary from "sections/src/target/ProtVista/Summary";
import MolecularInteractionsSummary from "sections/src/target/MolecularInteractions/Summary";
import PathwaysSummary from "sections/src/target/Pathways/Summary";
import CancerHallmarksSummary from "sections/src/target/CancerHallmarks/Summary";
import MousePhenotypesSummary from "sections/src/target/MousePhenotypes/Summary";
import ComparativeGenomicsSummary from "sections/src/target/ComparativeGenomics/Summary";
import SubcellularLocationSummary from "sections/src/target/SubcellularLocation/Summary";
import BibliographySummary from "sections/src/target/Bibliography/Summary";

import ProfileHeader from "./ProfileHeader";
import client from "../../client";

const KnownDrugsSection = lazy(() => import("sections/src/target/KnownDrugs/Body"));
const TractabilitySection = lazy(() => import("sections/src/target/Tractability/Body"));
const SafetySection = lazy(() => import("sections/src/target/Safety/Body"));
const PharmacogenomicsSection = lazy(() => import("sections/src/target/Pharmacogenomics/Body"));
const ChemicalProbesSection = lazy(() => import("sections/src/target/ChemicalProbes/Body"));
const BaselineExpressionSection = lazy(() => import("sections/src/target/Expression/Body"));
const DepMapSection = lazy(() => import("sections/src/target/DepMap/Body"));
const GeneOntologySection = lazy(() => import("sections/src/target/GeneOntology/Body"));
const GeneticConstraintSection = lazy(() => import("sections/src/target/GeneticConstraint/Body"));
const ProtVistaSection = lazy(() => import("sections/src/target/ProtVista/Body"));
const MolecularInteractionsSection = lazy(() =>
  import("sections/src/target/MolecularInteractions/Body")
);
const PathwaysSection = lazy(() => import("sections/src/target/Pathways/Body"));
const CancerHallmarksSection = lazy(() => import("sections/src/target/CancerHallmarks/Body"));
const MousePhenotypesSection = lazy(() => import("sections/src/target/MousePhenotypes/Body"));
const ComparativeGenomicsSection = lazy(() =>
  import("sections/src/target/ComparativeGenomics/Body")
);
const SubcellularLocationSection = lazy(() =>
  import("sections/src/target/SubcellularLocation/Body")
);
const BibliographySection = lazy(() => import("sections/src/target/Bibliography/Body"));

const summaries = [
  KnownDrugsSummary,
  TractabilitySummary,
  SafetySummary,
  PharmacogenomicsSummary,
  ChemicalProbesSummary,
  BaselineExpressionSummary,
  DepMapSummary,
  GeneOntologySummary,
  GeneticConstraintSummary,
  ProtVistaSummary,
  MolecularInteractionsSummary,
  PathwaysSummary,
  CancerHallmarksSummary,
  MousePhenotypesSummary,
  ComparativeGenomicsSummary,
  SubcellularLocationSummary,
  BibliographySummary,
];

const TARGET = "target";
const TARGET_PROFILE_SUMMARY_FRAGMENT = summaryUtils.createSummaryFragment(summaries, "Target");
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
        <PharmacogenomicsSummary />
        <ChemicalProbesSummary />
        <BaselineExpressionSummary />
        <DepMapSummary />
        <SubcellularLocationSummary />
        <GeneOntologySummary />
        <GeneticConstraintSummary />
        <ProtVistaSummary />
        <MolecularInteractionsSummary />
        <PathwaysSummary />
        <CancerHallmarksSummary />
        <MousePhenotypesSummary />
        <ComparativeGenomicsSummary />
        <BibliographySummary />
      </SummaryContainer>

      <SectionContainer>
        <Suspense fallback={<SectionLoader />}>
          <KnownDrugsSection id={ensgId} label={symbol} entity={TARGET} />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <TractabilitySection id={ensgId} label={symbol} entity={TARGET} />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <SafetySection id={ensgId} label={symbol} entity={TARGET} />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <PharmacogenomicsSection id={ensgId} label={symbol} entity={TARGET} />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <ChemicalProbesSection id={ensgId} label={symbol} entity={TARGET} />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <BaselineExpressionSection id={ensgId} label={symbol} entity={TARGET} />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <DepMapSection id={ensgId} label={symbol} entity={TARGET} />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <SubcellularLocationSection id={ensgId} label={symbol} entity={TARGET} />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <GeneOntologySection id={ensgId} label={symbol} entity={TARGET} />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <GeneticConstraintSection id={ensgId} label={symbol} entity={TARGET} />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <ProtVistaSection id={ensgId} label={symbol} entity={TARGET} />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <MolecularInteractionsSection id={ensgId} label={symbol} entity={TARGET} />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <PathwaysSection id={ensgId} label={symbol} entity={TARGET} />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <CancerHallmarksSection id={ensgId} label={symbol} entity={TARGET} />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <MousePhenotypesSection id={ensgId} label={symbol} entity={TARGET} />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <ComparativeGenomicsSection id={ensgId} label={symbol} entity={TARGET} />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <BibliographySection id={ensgId} label={symbol} entity={TARGET} />
        </Suspense>
      </SectionContainer>
    </PlatformApiProvider>
  );
}

export default Profile;
