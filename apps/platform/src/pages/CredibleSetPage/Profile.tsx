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
import GWASMolQTLSummary from "sections/src/credibleSet/MolQTLColoc/Summary";
import Locus2GeneSummary from "sections/src/credibleSet/Locus2Gene/Summary";

import ProfileHeader from "./ProfileHeader";

const MolQTLColocSection = lazy(() => import("sections/src/credibleSet/MolQTLColoc/Body"));
const VariantsSection = lazy(() => import("sections/src/credibleSet/Variants/Body"));
const GWASColocSection = lazy(() => import("sections/src/credibleSet/GWASColoc/Body"));
const Locus2GeneSection = lazy(() => import("sections/src/credibleSet/Locus2Gene/Body"));

const CREDIBLE_SET = "credibleSet";

function Profile({
  studyLocusId,
  variantId,
  referenceAllele,
  alternateAllele,
  loading,
}: ProfileProps) {
  const summaries = [VariantsSummary, Locus2GeneSummary, GWASColocSummary, GWASMolQTLSummary];

  const CREDIBLE_SET_PROFILE_SUMMARY_FRAGMENT = summaryUtils.createSummaryFragment(
    summaries,
    "CredibleSet",
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

  if (loading) return <></>;

  return (
    <PlatformApiProvider
      entity={CREDIBLE_SET}
      query={CREDIBLE_SET_PROFILE_QUERY}
      variables={{ studyLocusId: studyLocusId, variantIds: [variantId] }}
    >
      <ProfileHeader />

      <SummaryContainer>
        <VariantsSummary />
        <Locus2GeneSummary />
        <GWASColocSummary />
        <GWASMolQTLSummary />
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

        <Suspense fallback={<SectionLoader />}>
          <GWASColocSection studyLocusId={studyLocusId} entity={CREDIBLE_SET} />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <MolQTLColocSection studyLocusId={studyLocusId} entity={CREDIBLE_SET} />
        </Suspense>
      </SectionContainer>
    </PlatformApiProvider>
  );
}

export default Profile;
