import { gql } from "@apollo/client";
import { PlatformApiProvider, SectionContainer, SummaryContainer, summaryUtils } from "ui";
import MechanismsOfActionSummary from "sections/src/drug/MechanismsOfAction/Summary";
import IndicationsSummary from "sections/src/drug/Indications/Summary";
import KnownDrugsSummary from "sections/src/drug/KnownDrugs/Summary";
import DrugWarningsSummary from "sections/src/drug/DrugWarnings/Summary";
import PharmacogenomicsSummary from "sections/src/drug/Pharmacogenomics/Summary";
import AdverseEventsSummary from "sections/src/drug/AdverseEvents/Summary";
import BibliographySummary from "sections/src/drug/Bibliography/Summary";

import MechanismsOfActionSection from "sections/src/drug/MechanismsOfAction/Body";
import IndicationsSection from "sections/src/drug/Indications/Body";
import KnownDrugsSection from "sections/src/drug/KnownDrugs/Body";
import DrugWarningsSection from "sections/src/drug/DrugWarnings/Body";
import PharmacogenomicsSection from "sections/src/drug/Pharmacogenomics/Body";
import AdverseEventsSection from "sections/src/drug/AdverseEvents/Body";
import BibliographySection from "sections/src/drug/Bibliography/Body";

import client from "../../client";
import ProfileHeader from "./ProfileHeader";

const summaries = [
  MechanismsOfActionSummary,
  IndicationsSummary,
  KnownDrugsSummary,
  DrugWarningsSummary,
  PharmacogenomicsSummary,
  AdverseEventsSummary,
  BibliographySummary,
];

const DRUG = "drug";
const DRUG_PROFILE_SUMMARY_FRAGMENT = summaryUtils.createSummaryFragment(summaries, "Drug");
const DRUG_PROFILE_QUERY = gql`
  query DrugProfileQuery($chemblId: String!) {
    drug(chemblId: $chemblId) {
      id
      ...DrugProfileHeaderFragment
      ...DrugProfileSummaryFragment
    }
  }
  ${ProfileHeader.fragments.profileHeader}
  ${DRUG_PROFILE_SUMMARY_FRAGMENT}
`;

function Profile({ chemblId, name }) {
  return (
    <PlatformApiProvider
      entity={DRUG}
      query={DRUG_PROFILE_QUERY}
      variables={{ chemblId }}
      client={client}
    >
      <ProfileHeader chemblId={chemblId} />

      <SummaryContainer>
        <MechanismsOfActionSummary />
        <IndicationsSummary />
        <KnownDrugsSummary />
        <DrugWarningsSummary />
        <PharmacogenomicsSummary />
        <AdverseEventsSummary />
        <BibliographySummary />
      </SummaryContainer>

      <SectionContainer>
        <MechanismsOfActionSection id={chemblId} label={name} entity={DRUG} />
        <IndicationsSection id={chemblId} label={name} entity={DRUG} />
        <KnownDrugsSection id={chemblId} label={name} entity={DRUG} />
        <DrugWarningsSection id={chemblId} label={name} entity={DRUG} />
        <PharmacogenomicsSection id={chemblId} label={name} entity={DRUG} />
        <AdverseEventsSection id={chemblId} label={name} entity={DRUG} />
        <BibliographySection id={chemblId} label={name} entity={DRUG} />
      </SectionContainer>
    </PlatformApiProvider>
  );
}

export default Profile;
