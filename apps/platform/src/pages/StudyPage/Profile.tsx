import { Suspense, lazy } from "react";
import { gql } from "@apollo/client";
import {
  PlatformApiProvider,
  SectionContainer,
  SummaryContainer,
  SectionLoader,
  summaryUtils,
} from "ui";

import QTLCredibleSetsSummary from "sections/src/study/QTLCredibleSets/Summary";

import client from "../../client";
import ProfileHeader from "./ProfileHeader";

const QTLCredibleSetsSection = lazy(
  () => import("sections/src/study/QTLCredibleSets/Body")
);

const summaries = [
  QTLCredibleSetsSummary,
];

const STUDY = "gwasStudy";
const STUDY_PROFILE_SUMMARY_FRAGMENT = summaryUtils.createSummaryFragment(
  summaries,
  "Gwas",
  "StudyProfileSummaryFragment"
);
const STUDY_PROFILE_QUERY = gql`
  query StudyProfileQuery($studyId: String!) {
    gwasStudy(studyId: $studyId) {
      studyId
      ...StudyProfileHeaderFragment
      ...StudyProfileSummaryFragment
    }
  }
  ${ProfileHeader.fragments.profileHeader}
  ${STUDY_PROFILE_SUMMARY_FRAGMENT}
`;

type ProfileProps = {
  studyId: string;
  studyCategory: string;
};

function Profile({ studyId, studyCategory }: ProfileProps) {
  return (
    <PlatformApiProvider
      entity={STUDY}
      query={STUDY_PROFILE_QUERY}
      variables={{ studyId }}
      client={client}
    >
      <ProfileHeader studyCategory={studyCategory} />

      <SummaryContainer>
        {studyCategory === "QTL" &&
          <QTLCredibleSetsSummary /> 
        }
      </SummaryContainer>

      <SectionContainer>
        {studyCategory === "QTL" &&
          <Suspense fallback={<SectionLoader />}>
            <QTLCredibleSetsSection id={studyId} entity={STUDY} />
          </Suspense>
        }
      </SectionContainer>

    </PlatformApiProvider>
  );
}

export default Profile;