import { Suspense, lazy } from "react";
import {
  // PlatformApiProvider,
  SectionContainer,
  SummaryContainer,
  SectionLoader,
} from "ui";

import InSilicoPredictorsSummary from "sections/src/variant/InSilicoPredictors/Summary";
import EVASummary from "sections/src/variant/EVA/Summary";
import UniProtVariantsSummary from "sections/src/variant/UniProtVariants/Summary";
import PharmacogenomicsSummary from "sections/src/variant/Pharmacogenomics/Summary";

import ProfileHeader from "./ProfileHeader";

const InSilicoPredictorsSection = lazy(() => import("sections/src/variant/InSilicoPredictors/Body"));
const EVASection = lazy(() => import("sections/src/variant/EVA/Body"));
const UniProtVariantsSection = lazy(() => import("sections/src/variant/UniProtVariants/Body"));
const PharmacogenomicsSection = lazy(() => import("sections/src/variant/Pharmacogenomics/Body"));

const summaries = [
  InSilicoPredictorsSummary,
  EVASummary,
  UniProtVariantsSummary,
  PharmacogenomicsSummary,
];

const VARIANT = "variant";

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// TO DO (see e.g. profile.jsx for the evidence page):
// - VARIANT_PROFILE_SUMMARY_FRAGMENT
// - EVIDENCE_PROFILE_QUERY
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

type ProfileProps = {
  varId: string;
};

function Profile({ varId }: ProfileProps) {
  
  return (
    // !!!!!!!!!!
    // PUT EVERYTHING INSIDE <PlatformApiProvider> INSTEAD OF FRAGMENT
    // !!!!!!!!!!
    <>

      <ProfileHeader varId={varId} />

      <SummaryContainer>
        <InSilicoPredictorsSummary />
        <EVASummary />
        <UniProtVariantsSummary />
        <PharmacogenomicsSummary />
      </SummaryContainer>
    
      <SectionContainer>
        <Suspense fallback={<SectionLoader />}>
          <InSilicoPredictorsSection id={varId} label='NO-LABEL!' entity={VARIANT} />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <EVASection id={varId} label='NO-LABEL!' entity={VARIANT} />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <UniProtVariantsSection id={varId} label='NO-LABEL!' entity={VARIANT} />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <PharmacogenomicsSection id={varId} label='NO-LABEL!' entity={VARIANT} />
        </Suspense>
        {/* NEED ANYTHING IN <PrivateWrapper> ???? see evidence page */}
      </SectionContainer>
  
    </>

  );

}

export default Profile;