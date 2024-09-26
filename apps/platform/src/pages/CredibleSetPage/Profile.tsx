import { Suspense, lazy } from "react";
import { gql } from "@apollo/client";
import {
  PlatformApiProvider,
  SectionContainer,
  SummaryContainer,
  SectionLoader,
  summaryUtils,
} from "ui";

// import PharmacogenomicsSummary from "sections/src/variant/Pharmacogenomics/Summary";

import client from "../../client";
import ProfileHeader from "./ProfileHeader";
// const PharmacogenomicsSection = lazy(
//   () => import("sections/src/variant/Pharmacogenomics/Body")
// );

const summaries = [
  // PharmacogenomicsSummary,
];

const CREDIBLE_SET = "credibleSets";
const CREDIBLE_SET_PROFILE_SUMMARY_FRAGMENT = summaryUtils.createSummaryFragment(
  summaries,
  "credibleSet"
);
const CREDIBLE_SET_PROFILE_QUERY = gql`
  query CredibleSetProfileQuery($studyLocusIds: [String!]!) {
    credibleSets(studyLosucIds: $studyLocusIds) {
      studyLocusId
      ...CredibleSetProfileHeaderFragment
      ...CredibleSetProfileSummaryFragment
    }
  }
  ${ProfileHeader.fragments.profileHeader}
  ${CREDIBLE_SET_PROFILE_SUMMARY_FRAGMENT}
`;

type ProfileProps = {
  studyLocusId: string;
};

function Profile({ studyLocusId }: ProfileProps) {
  return (
    <PlatformApiProvider
      entity={CREDIBLE_SET}
      query={CREDIBLE_SET_PROFILE_QUERY}
      variables={{ studyLocusIds: [studyLocusId] }}
      client={client}
    >
      <ProfileHeader />

      <SummaryContainer>
        {/* <PharmacogenomicsSummary />  */}
      </SummaryContainer>

      <SectionContainer>
        {/* <Suspense fallback={<SectionLoader />}>
          <PharmacogenomicsSection id={varId} entity={VARIANT} />
        </Suspense> */}
      </SectionContainer>
    </PlatformApiProvider>
  );
}

export default Profile;
