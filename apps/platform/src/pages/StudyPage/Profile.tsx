import { Suspense, lazy } from "react";
import { gql } from "@apollo/client";
import {
  PlatformApiProvider,
  SectionContainer,
  SummaryContainer,
  SectionLoader,
  summaryUtils,
} from "ui";

import SharedTraitStudiesSummary from "sections/src/study/SharedTraitStudies/Summary";
import GWASCredidbleSetsSummary from "sections/src/study/GWASCredibleSets/Summary";
import QTLCredibleSetsSummary from "sections/src/study/QTLCredibleSets/Summary";

import ProfileHeader from "./StudyProfileHeader";

const SharedTraitStudiesSection = lazy(() => import("sections/src/study/SharedTraitStudies/Body"));
const GWASCredibleSetsSection = lazy(() => import("sections/src/study/GWASCredibleSets/Body"));
const QTLCredibleSetsSection = lazy(() => import("sections/src/study/QTLCredibleSets/Body"));

// no SharedTraitStudiesSummary as we add section to the query below directly
// (the summary cannot be written as a fragment as it gets further studies)
const summaries = [GWASCredidbleSetsSummary, QTLCredibleSetsSummary];

const STUDY = "study";
const STUDY_PROFILE_SUMMARY_FRAGMENT = summaryUtils.createSummaryFragment(
  summaries,
  "Study",
  "StudyProfileSummaryFragment"
);
const STUDY_PROFILE_QUERY = gql`
  query StudyProfileQuery($studyId: String!, $diseaseIds: [String!]!) {
    study(studyId: $studyId) {
      id
      ...StudyProfileHeaderFragment
      ...StudyProfileSummaryFragment
    }
    sharedTraitStudies: studies(diseaseIds: $diseaseIds, page: { size: 2, index: 0 }) {
      count
    }
  }
  ${ProfileHeader.fragments.profileHeader}
  ${STUDY_PROFILE_SUMMARY_FRAGMENT}
`;

type ProfileProps = {
  studyId: string;
  studyCategory: string;
  diseases: {
    id: string;
    name: string;
  }[];
};

function Profile({ studyId, studyType, projectId, diseases }: ProfileProps) {
  const diseaseIds = diseases?.map(d => d.id) || [];

  return (
    <PlatformApiProvider
      entity={STUDY}
      query={STUDY_PROFILE_QUERY}
      variables={{
        studyId,
        diseaseIds,
      }}
    >
      <ProfileHeader />

      <SummaryContainer>
        {studyType === "gwas" && (
          <>
            <GWASCredidbleSetsSummary />
            <SharedTraitStudiesSummary />
          </>
        )}
        {studyType !== "gwas" && <QTLCredibleSetsSummary />}
      </SummaryContainer>

      <SectionContainer>
        {studyType === "gwas" && (
          <>
            <Suspense fallback={<SectionLoader />}>
              <GWASCredibleSetsSection id={studyId} entity={STUDY} />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
              <SharedTraitStudiesSection studyId={studyId} diseaseIds={diseaseIds} entity={STUDY} />
            </Suspense>
          </>
        )}
        {studyType !== "gwas" && (
          <Suspense fallback={<SectionLoader />}>
            <QTLCredibleSetsSection id={studyId} entity={STUDY} />
          </Suspense>
        )}
      </SectionContainer>
    </PlatformApiProvider>
  );
}

export default Profile;
