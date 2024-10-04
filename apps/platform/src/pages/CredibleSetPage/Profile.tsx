import { Suspense, lazy } from "react";
import { gql } from "@apollo/client";
import {
  PlatformApiProvider,
  SectionContainer,
  SummaryContainer,
  SectionLoader,
  summaryUtils,
} from "ui";

import VariantsSummary from "sections/src/credibleSet/Variants/Summary";

import client from "../../client";
import ProfileHeader from "./ProfileHeader";
const VariantsSection = lazy(
  () => import("sections/src/credibleSet/Variants/Body")
);

const summaries = [
  VariantsSummary,
];

const CREDIBLE_SET = "credibleSets";
const CREDIBLE_SET_PROFILE_SUMMARY_FRAGMENT = summaryUtils.createSummaryFragment(
  summaries,
  "credibleSet",
  "CredibleSetProfileSummaryFragment"
);
const CREDIBLE_SET_PROFILE_QUERY = gql`
  query CredibleSetProfileQuery($studyLocusIds: [String!]!) {
    credibleSets(studyLocusIds: $studyLocusIds) {
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
  variantId: string;
  referenceAllele: string;
  alternateAllele: string;
};

function Profile({
      studyLocusId,
      variantId,
      referenceAllele,
      alternateAllele,
    }: ProfileProps) {

  return (
    <PlatformApiProvider
      entity={CREDIBLE_SET}
      query={CREDIBLE_SET_PROFILE_QUERY}
      variables={{ studyLocusIds: [studyLocusId] }}
      client={client}
    >
      <ProfileHeader variantId={variantId} />

      <SummaryContainer>
        <VariantsSummary /> 
      </SummaryContainer>

      <SectionContainer>
        <Suspense fallback={<SectionLoader />}>
          <VariantsSection
            studyLocusId={studyLocusId}
            leadVariantId={variantId}
            leadReferenceAllele={referenceAllele}
            leadAlternateAllele={alternateAllele}
            entity={CREDIBLE_SET}
          />
        </Suspense>
      </SectionContainer>
    </PlatformApiProvider>
  );

}

export default Profile;
