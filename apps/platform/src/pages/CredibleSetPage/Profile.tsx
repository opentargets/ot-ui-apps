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
import GWASColocSummary from "sections/src/credibleSet/GWASColoc/Summary";
import GWASMolQTLSummary from "sections/src/credibleSet/GWASMolQTL/Summary";

import client from "../../client";
import ProfileHeader from "./ProfileHeader";

const VariantsSection = lazy(() => import("sections/src/credibleSet/Variants/Body"));
const GWASColocSection = lazy(() => import("sections/src/credibleSet/GWASColoc/Body"));
const GWASMolQTLSection = lazy(() => import("sections/src/credibleSet/GWASMolQTL/Body"));

const summaries = [VariantsSummary, GWASColocSummary];

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
  studyType,
}: ProfileProps) {
  console.log({ studyType });
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
        {studyType === "gwas" && (
          <>
            <GWASColocSummary />
          </>
        )}
        {studyType !== "gwas" && <GWASMolQTLSummary />}
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
        {studyType === "gwas" && (
          <Suspense fallback={<SectionLoader />}>
            <GWASColocSection studyLocusId={studyLocusId} entity={CREDIBLE_SET} />
          </Suspense>
        )}
        {studyType !== "gwas" && (
          <Suspense fallback={<SectionLoader />}>
            <GWASMolQTLSection studyLocusId={studyLocusId} entity={CREDIBLE_SET} />
          </Suspense>
        )}
      </SectionContainer>
    </PlatformApiProvider>
  );
}

export default Profile;
