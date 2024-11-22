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
import Locus2GeneSummary from "sections/src/credibleSet/Locus2Gene/Summary";

import client from "../../client";
import ProfileHeader from "./ProfileHeader";

const GWASMolQTLSection = lazy(() => import("sections/src/credibleSet/GWASMolQTL/Body"));
const VariantsSection = lazy(() => import("sections/src/credibleSet/Variants/Body"));
const GWASColocSection = lazy(() => import("sections/src/credibleSet/GWASColoc/Body"));

const Locus2GeneSection = lazy(() => import("sections/src/credibleSet/Locus2Gene/Body"));

const CREDIBLE_SET = "credibleSet";

const createProfileQuery = (studyType: string) => {
  const summaries = [VariantsSummary, Locus2GeneSummary];
  if (studyType === "gwas") {
    summaries.push(GWASColocSummary);
  }
  if (studyType !== "gwas") {
    summaries.push(GWASMolQTLSummary);
  }

  const CREDIBLE_SET_PROFILE_SUMMARY_FRAGMENT = summaryUtils.createSummaryFragment(
    summaries,
    "credibleSet",
    "CredibleSetProfileSummaryFragment"
  );

  const CREDIBLE_SET_PROFILE_QUERY = gql`
    query CredibleSetProfileQuery($studyLocusId: String!, $variantIds: [String!]!) {
      credibleSet(studyLocusId: $studyLocusId) {
        studyLocusId
        ...CredibleSetProfileHeaderFragment
        ...CredibleSetProfileSummaryFragment
      }
    }
    ${ProfileHeader.fragments.profileHeader}
    ${CREDIBLE_SET_PROFILE_SUMMARY_FRAGMENT}
  `;
  return CREDIBLE_SET_PROFILE_QUERY;
};

function Profile({
  studyLocusId,
  variantId,
  referenceAllele,
  alternateAllele,
  studyType,
}: ProfileProps) {
  const CREDIBLE_SET_PROFILE_QUERY = createProfileQuery(studyType);
  return (
    <PlatformApiProvider
      entity={CREDIBLE_SET}
      query={CREDIBLE_SET_PROFILE_QUERY}
      variables={{ studyLocusId: studyLocusId, variantIds: [variantId] }}
      client={client}
    >
      <ProfileHeader variantId={variantId} />

      <SummaryContainer>
        <VariantsSummary />
        <Locus2GeneSummary />
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
        <Suspense fallback={<SectionLoader />}>
          <Locus2GeneSection studyLocusId={studyLocusId} entity={CREDIBLE_SET} />
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
