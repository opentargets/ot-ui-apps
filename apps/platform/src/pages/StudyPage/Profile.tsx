import { gql } from "@apollo/client";
import { PlatformApiProvider, SectionContainer, SummaryContainer, summaryUtils } from "ui";

import client from "../../client";
import ProfileHeader from "./ProfileHeader";

// const summaries = [
// ];

const STUDY = "study";
// const STUDY_PROFILE_SUMMARY_FRAGMENT = summaryUtils.createSummaryFragment(summaries, "Gwas");
const STUDY_PROFILE_QUERY = gql`
  query StudyProfileQuery($studyId: String!) {
    gwasStudy(studyId: $studyId) {
      studyId
      ...StudyProfileHeaderFragment
    }
  }
  ${ProfileHeader.fragments.profileHeader}
`;
// const STUDY_PROFILE_QUERY = gql`
//   query StudyProfileQuery($chemblId: String!) {
//     gwasStudy(studyId: $studyId) {
//       studyId
//       ...StudyProfileHeaderFragment
//       ...StudyProfileSummaryFragment
//     }
//   }
//   ${ProfileHeader.fragments.profileHeader}
//   ${STUDY_PROFILE_SUMMARY_FRAGMENT}
// `;

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
    </PlatformApiProvider>
  );
}

export default Profile;
