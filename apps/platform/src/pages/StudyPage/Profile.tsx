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

import client from "../../client";
import ProfileHeader from "./ProfileHeader";

const SharedTraitStudiesSection = lazy(
  () => import("sections/src/study/SharedTraitStudies/Body")
);
const GWASCredibleSetsSection = lazy(() => import("sections/src/study/GWASCredibleSets/Body"));
const QTLCredibleSetsSection = lazy(() => import("sections/src/study/QTLCredibleSets/Body"));

// no SharedTraitStudiesSummary as we add section to the query below directly
// (the summary cannot be written as a fragment as it gets further studies)
const summaries = [GWASCredidbleSetsSummary, QTLCredibleSetsSummary];

const STUDY = "gwasStudy";
const STUDY_PROFILE_SUMMARY_FRAGMENT = summaryUtils.createSummaryFragment(
  summaries,
  "Gwas",
  "StudyProfileSummaryFragment"
);
const STUDY_PROFILE_QUERY = gql`
  query StudyProfileQuery($studyId: String!, $diseaseIds: [String!]!) {
    gwasStudy(studyId: $studyId) {
      studyId
      ...StudyProfileHeaderFragment
      ...StudyProfileSummaryFragment
    }
    sharedTraitStudies: gwasStudy(diseaseIds: $diseaseIds, page: { size: 2, index: 0}) {
      studyId
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

function Profile({ studyId, studyCategory, diseases }: ProfileProps) {
  const diseaseIds = diseases?.map(d => d.id) || [];

  return (
    <PlatformApiProvider
      entity={STUDY}
      query={STUDY_PROFILE_QUERY}
      variables={{
        studyId,
        diseaseIds,
      }}
      client={client}
    >
      <ProfileHeader studyCategory={studyCategory} />

      <SummaryContainer>
        {(studyCategory === "GWAS" || studyCategory === "FINNGEN") &&
          <>
            <SharedTraitStudiesSummary />
            <GWASCredidbleSetsSummary />
          </>
        }
        {studyCategory === "QTL" &&
          <QTLCredibleSetsSummary />
        }
      </SummaryContainer>

      <SectionContainer>
        {(studyCategory === "GWAS" || studyCategory === "FINNGEN") &&
          <>
            <Suspense fallback={<SectionLoader />}>
              <SharedTraitStudiesSection
                studyId={studyId}
                diseaseIds={diseaseIds}
                entity={STUDY}
              />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
              <GWASCredibleSetsSection id={studyId} entity={STUDY} />
            </Suspense>
          </>
        }
        {studyCategory === "QTL" && (
          <Suspense fallback={<SectionLoader />}>
            <QTLCredibleSetsSection id={studyId} entity={STUDY} />
          </Suspense>
        )}
      </SectionContainer>
    </PlatformApiProvider>
  );
}

export default Profile;