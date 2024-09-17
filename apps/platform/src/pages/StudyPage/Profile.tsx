import { Suspense, lazy } from "react";
import { gql } from "@apollo/client";
import {
  PlatformApiProvider,
  SectionContainer,
  SummaryContainer,
  SectionLoader,
  summaryUtils,
} from "ui";

import RelatedGWASStudiesSummary from "sections/src/study/RelatedGWASStudies/Summary";

import client from "../../client";
import ProfileHeader from "./ProfileHeader";

const RelatedGWASStudiesSection = lazy(
  () => import("sections/src/study/RelatedGWASStudies/Body")
);

// no RelatedGWASStudiesSummary as we add section to the query below directly
// (the summary cannot be written as a fragment as it gets further studies)
const summaries = [
];

const STUDY = "gwasStudy";
const STUDY_PROFILE_SUMMARY_FRAGMENT = summaryUtils.createSummaryFragment(
  summaries,
  "Gwas",
  "StudyProfileSummaryFragment"
);
const STUDY_PROFILE_QUERY = gql`
  query StudyProfileQuery($studyId: String!, $diseaseId: String!) {
    gwasStudy(studyId: $studyId) {
      studyId
      ...StudyProfileHeaderFragment
      ...StudyProfileSummaryFragment
    }
    relatedGWASStudies: gwasStudy(diseaseId: $diseaseId, page: { size: 2, index: 0}) {
      studyId
    }
  }
  ${ProfileHeader.fragments.profileHeader}
  ${STUDY_PROFILE_SUMMARY_FRAGMENT}
`;

type ProfileProps = {
  studyId: string;
  studyCategory: string;
  diseaseIds: string[];
};

function Profile({ studyId, studyCategory, diseaseIds }: ProfileProps) {
  const diseaseId = diseaseIds?.[0] || "";  // !! WILL LEAVE AS diseaseIds WHEN API UPDATED !!

  return (
    <PlatformApiProvider
      entity={STUDY}
      query={STUDY_PROFILE_QUERY}
      variables={{
        studyId,
        diseaseId,  // !! WILL BE diseaseIds WHEN API UPDATED !!
      }}
      client={client}
    >
      <ProfileHeader studyCategory={studyCategory} />

      <SummaryContainer>
        {(studyCategory === "GWAS" || studyCategory === "FINNGEN") &&
          <RelatedGWASStudiesSummary /> 
        }
      </SummaryContainer>

      <SectionContainer>
        {(studyCategory === "GWAS" || studyCategory === "FINNGEN") &&
          <Suspense fallback={<SectionLoader />}>
            <RelatedGWASStudiesSection
              studyId={studyId}
              diseaseId={diseaseId}  // !! WILL BE diseaseIds WHEN API UPDATED !!
              entity={STUDY}
            />
          </Suspense>
        }
      </SectionContainer>

    </PlatformApiProvider>
  );
}

export default Profile;