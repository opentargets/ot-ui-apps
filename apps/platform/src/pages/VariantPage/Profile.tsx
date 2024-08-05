import { Suspense, lazy } from "react";
import { gql } from "@apollo/client";
import {
  PlatformApiProvider,
  SectionContainer,
  SummaryContainer,
  SectionLoader,
  summaryUtils,
} from "ui";

import InSilicoPredictorsSummary from "sections/src/variant/InSilicoPredictors/Summary";
import VariantEffectPredictorSummary from "sections/src/variant/VariantEffectPredictor/Summary";
// import EVASummary from "sections/src/variant/EVA/Summary";
// import UniProtVariantsSummary from "sections/src/variant/UniProtVariants/Summary";
// import QTLCredibleSetsSummary from "sections/src/variant/QTLCredibleSets/Summary";
import GWASCredibleSetsSummary from "sections/src/variant/GWASCredibleSets/Summary";
// import PharmacogenomicsSummary from "sections/src/variant/Pharmacogenomics/Summary";

import client from "../../client";
import ProfileHeader from "./ProfileHeader";

const InSilicoPredictorsSection = lazy(
  () => import("sections/src/variant/InSilicoPredictors/Body")
);
const VariantEffectPredictorSection = lazy(
  () => import("sections/src/variant/VariantEffectPredictor/Body")
);
// const EVASection = lazy(() => import("sections/src/variant/EVA/Body"));
// const UniProtVariantsSection = lazy(() => import("sections/src/variant/UniProtVariants/Body"));
// const QTLCredibleSetsSection = lazy(() => import("sections/src/variant/QTLCredibleSets/Body"));
const GWASCredibleSetsSection = lazy(() => import("sections/src/variant/GWASCredibleSets/Body"));
// const PharmacogenomicsSection = lazy(() => import("sections/src/variant/Pharmacogenomics/Body"));

const summaries = [
  InSilicoPredictorsSummary,
  VariantEffectPredictorSummary,
  // EVASummary,
  // UniProtVariantsSummary,
  // QTLCredibleSetsSummary,
  GWASCredibleSetsSummary,
  // PharmacogenomicsSummary,
];

const VARIANT = "variant";
const VARIANT_PROFILE_SUMMARY_FRAGMENT = summaryUtils.createSummaryFragment(
  summaries,
  "VariantIndex"
);
const VARIANT_PROFILE_QUERY = gql`
  query VariantProfileQuery($variantId: String!) {
    variant(variantId: $variantId) {
      variantId
      ...VariantProfileHeaderFragment
      ...VariantIndexProfileSummaryFragment
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
      client={client}
    >
      <ProfileHeader />

      <SummaryContainer>
        <InSilicoPredictorsSummary />
        <VariantEffectPredictorSummary />
        {/* <EVASummary /> */}
        {/* <UniProtVariantsSummary /> */}
        {/* <QTLCredibleSetsSummary /> */}
        <GWASCredibleSetsSummary />
        {/* <PharmacogenomicsSummary /> */}
      </SummaryContainer>

      <SectionContainer>
        <Suspense fallback={<SectionLoader />}>
          <InSilicoPredictorsSection id={varId} entity={VARIANT} />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <VariantEffectPredictorSection id={varId} entity={VARIANT} />
        </Suspense>
        {/* <Suspense fallback={<SectionLoader />}>
          <EVASection id={varId} label='NO-LABEL!' entity={VARIANT} />
        </Suspense> */}
        {/* <Suspense fallback={<SectionLoader />}>
          <UniProtVariantsSection id={varId} label='NO-LABEL!' entity={VARIANT} />
        </Suspense> */}
        {/* <Suspense fallback={<SectionLoader />}>
          <QTLCredibleSetsSection id={varId} label='NO-LABEL!' entity={VARIANT} />
        </Suspense> */}
        <Suspense fallback={<SectionLoader />}>
          <GWASCredibleSetsSection id={varId} label='NO-LABEL!' entity={VARIANT} />
        </Suspense>
        {/* <Suspense fallback={<SectionLoader />}>
          <PharmacogenomicsSection id={varId} label='NO-LABEL!' entity={VARIANT} />
        </Suspense> */}
      </SectionContainer>
    </PlatformApiProvider>
  );
}

export default Profile;
