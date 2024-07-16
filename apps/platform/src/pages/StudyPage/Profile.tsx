import { gql } from "@apollo/client";
import { PlatformApiProvider, SectionContainer, SummaryContainer, summaryUtils } from "ui";

// import MechanismsOfActionSummary from "sections/src/drug/MechanismsOfAction/Summary";

// import MechanismsOfActionSection from "sections/src/drug/MechanismsOfAction/Body";

import client from "../../client";
import ProfileHeader from "./ProfileHeader";

// const summaries = [
//   MechanismsOfActionSummary,
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
//       ...DrugProfileSummaryFragment
//     }
//   }
//   ${ProfileHeader.fragments.profileHeader}
//   ${DRUG_PROFILE_SUMMARY_FRAGMENT}
// `;

function Profile({ studyId, studyType }) {
  return (
    <PlatformApiProvider
      entity={STUDY}
      query={STUDY_PROFILE_QUERY}
      variables={{ studyId }}
      client={client}
    >
      <ProfileHeader studyId={studyId} studyType={studyType} />

      {/* <SummaryContainer>
        <MechanismsOfActionSummary />
      </SummaryContainer> */}

      {/* <SectionContainer>
        <MechanismsOfActionSection id={chemblId} label={name} entity={DRUG} />
      </SectionContainer> */}
    </PlatformApiProvider>
  );
}

export default Profile;
