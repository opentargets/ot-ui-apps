import { Suspense, lazy } from "react";
import { gql } from "@apollo/client";
import {
  PlatformApiProvider,
  SectionContainer,
  SummaryContainer,
  SectionLoader,
  summaryUtils,
} from "ui";

import PharmacogenomicsSummary from "sections/src/variant/Pharmacogenomics/Summary";
import VariantEffectSummary from "sections/src/variant/VariantEffect/Summary";
import VariantEffectPredictorSummary from "sections/src/variant/VariantEffectPredictor/Summary";
import EVASummary from "sections/src/variant/EVA/Summary";
import UniProtVariantsSummary from "sections/src/variant/UniProtVariants/Summary";
import GWASCredibleSetsSummary from "sections/src/variant/GWASCredibleSets/Summary";
import QTLCredibleSetsSummary from "sections/src/variant/QTLCredibleSets/Summary";

import ProfileHeader from "./ProfileHeader";
const PharmacogenomicsSection = lazy(() => import("sections/src/variant/Pharmacogenomics/Body"));
const VariantEffectSection = lazy(() => import("sections/src/variant/VariantEffect/Body"));
const VariantEffectPredictorSection = lazy(
  () => import("sections/src/variant/VariantEffectPredictor/Body")
);
const EVASection = lazy(() => import("sections/src/variant/EVA/Body"));
const UniProtVariantsSection = lazy(() => import("sections/src/variant/UniProtVariants/Body"));
const GWASCredibleSetsSection = lazy(() => import("sections/src/variant/GWASCredibleSets/Body"));
const QTLCredibleSetsSection = lazy(() => import("sections/src/variant/QTLCredibleSets/Body"));

const summaries = [
  PharmacogenomicsSummary,
  VariantEffectSummary,
  VariantEffectPredictorSummary,
  EVASummary,
  UniProtVariantsSummary,
  GWASCredibleSetsSummary,
  QTLCredibleSetsSummary,
];

const VARIANT = "variant";
const VARIANT_PROFILE_SUMMARY_FRAGMENT = summaryUtils.createSummaryFragment(summaries, "Variant");
const VARIANT_PROFILE_QUERY = gql`
  query VariantProfileQuery($variantId: String!) {
    variant(variantId: $variantId) {
      id
      ...VariantProfileHeaderFragment
      ...VariantProfileSummaryFragment
    }
  }
  ${ProfileHeader.fragments.profileHeader}
  ${VARIANT_PROFILE_SUMMARY_FRAGMENT}
`;

type ProfileProps = {
  varId: string;
};

function Profile({ varId }: ProfileProps) {
  return (
    <PlatformApiProvider
      entity={VARIANT}
      query={VARIANT_PROFILE_QUERY}
      variables={{ variantId: varId }}
    >
      <ProfileHeader />

      <SummaryContainer>
        <VariantEffectSummary />
        <VariantEffectPredictorSummary />
        <EVASummary />
        <UniProtVariantsSummary />
        <GWASCredibleSetsSummary />
        <QTLCredibleSetsSummary />
        <PharmacogenomicsSummary />
      </SummaryContainer>

      <SectionContainer>
        <Suspense fallback={<SectionLoader />}>
          <VariantEffectSection id={varId} entity={VARIANT} />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <VariantEffectPredictorSection id={varId} entity={VARIANT} />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <EVASection id={varId} entity={VARIANT} />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <UniProtVariantsSection id={varId} entity={VARIANT} />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <GWASCredibleSetsSection id={varId} entity={VARIANT} />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <QTLCredibleSetsSection id={varId} entity={VARIANT} />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <PharmacogenomicsSection id={varId} entity={VARIANT} />
        </Suspense>
      </SectionContainer>
    </PlatformApiProvider>
  );
}

export default Profile;
