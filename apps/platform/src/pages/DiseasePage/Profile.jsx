import { gql } from "@apollo/client";
import { lazy, Suspense } from "react";

import {
  PlatformApiProvider,
  SectionContainer,
  SummaryContainer,
  summaryUtils,
  PrivateWrapper,
  SectionLoader,
} from "ui";

import OntologySummary from "sections/src/disease/Ontology/Summary";
import KnownDrugsSummary from "sections/src/disease/KnownDrugs/Summary";
import BibliographySummary from "sections/src/disease/Bibliography/Summary";
import PhenotypesSummary from "sections/src/disease/Phenotypes/Summary";
import OTProjectsSummary from "sections/src/disease/OTProjects/Summary";
import GWASStudiesSummary from "sections/src/disease/GWASStudies/Summary";

import ProfileHeader from "./ProfileHeader";

const OntologySection = lazy(() => import("sections/src/disease/Ontology/Body"));
const KnownDrugsSection = lazy(() => import("sections/src/disease/KnownDrugs/Body"));
const BibliographySection = lazy(() => import("sections/src/disease/Bibliography/Body"));
const PhenotypesSection = lazy(() => import("sections/src/disease/Phenotypes/Body"));
const OTProjectsSection = lazy(() => import("sections/src/disease/OTProjects/Body"));
const GWASStudiesSection = lazy(() => import("sections/src/disease/GWASStudies/Body"));

// no GWASStudiesSummary as we add section to the query below directly
// (the summary cannot be written as a fragment as it uses a different
//  endpoint - gwasStudy rather than disease)
const summaries = [
  OntologySummary,
  KnownDrugsSummary,
  BibliographySummary,
  PhenotypesSummary,
  OTProjectsSummary,
];

const DISEASE = "disease";
const DISEASE_PROFILE_SUMMARY_FRAGMENT = summaryUtils.createSummaryFragment(summaries, "Disease");
const DISEASE_PROFILE_QUERY = gql`
  query DiseaseProfileQuery($efoId: String!) {
    disease(efoId: $efoId) {
      id
      ...DiseaseProfileHeaderFragment
      ...DiseaseProfileSummaryFragment
    }
    studies(diseaseIds: [$efoId], page: { size: 1, index: 0 }) {
      count
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
      variables={{
        efoId,
      }}
    >
      <ProfileHeader />
      <SummaryContainer>
        <OntologySummary />
        <KnownDrugsSummary />
        <PhenotypesSummary />
        <GWASStudiesSummary />
        <BibliographySummary />
        <PrivateWrapper>
          <OTProjectsSummary />
        </PrivateWrapper>
      </SummaryContainer>

      <SectionContainer>
        <Suspense fallback={<SectionLoader />}>
          <OntologySection id={efoId} label={name} entity={DISEASE} />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <KnownDrugsSection id={efoId} label={name} entity={DISEASE} />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <PhenotypesSection id={efoId} label={name} entity={DISEASE} />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <GWASStudiesSection id={efoId} label={name} />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <BibliographySection id={efoId} label={name} entity={DISEASE} />
        </Suspense>
        <PrivateWrapper>
          <Suspense fallback={<SectionLoader />}>
            <OTProjectsSection id={efoId} label={name} entity={DISEASE} />
          </Suspense>
        </PrivateWrapper>
      </SectionContainer>
    </PlatformApiProvider>
  );
}

export default Profile;
