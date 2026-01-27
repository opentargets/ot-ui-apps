import {
  PlatformApiProvider,
  SectionContainer,
  SummaryContainer,
  SectionsRenderer,
  SummaryRenderer,
  summaryUtils,
} from "ui";
import { gql } from "@apollo/client";
import ProfileHeader from "./ProfileHeader";
import { Drug, Widget } from "sections";

const DRUG = "drug";

const drugProfileWidgets = new Map<string, Widget>([
  // [Drug.MechanismsOfAction.definition.id, Drug.MechanismsOfAction],
  [Drug.ClinicalIndications.definition.id, Drug.ClinicalIndications],
  [Drug.Indications.definition.id, Drug.Indications],
  // [Drug.KnownDrugs.definition.id, Drug.KnownDrugs],
  // [Drug.DrugWarnings.definition.id, Drug.DrugWarnings],
  // [Drug.Pharmacogenomics.definition.id, Drug.Pharmacogenomics],
  // [Drug.AdverseEvents.definition.id, Drug.AdverseEvents],
  // [Drug.Bibliography.definition.id, Drug.Bibliography],
]);

export const drugProfileWidgetsSummaries = Array.from(drugProfileWidgets.values()).map(
  widget => widget.Summary
);

const DRUG_PROFILE_SUMMARY_FRAGMENT = summaryUtils.createSummaryFragment(
  drugProfileWidgetsSummaries,
  "Drug"
);
export const DRUG_PROFILE_QUERY = gql`
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

const DRUG_WIDGETS = Array.from(drugProfileWidgets.values());

function Profile({ chemblId, name }: { chemblId: string; name: string }) {
  return (
    <PlatformApiProvider entity={DRUG} query={DRUG_PROFILE_QUERY} variables={{ chemblId }}>
      <ProfileHeader chemblId={chemblId} />
      <SummaryContainer>
        <SummaryRenderer widgets={DRUG_WIDGETS} />
      </SummaryContainer>
      <SectionContainer>
        <SectionsRenderer id={chemblId} label={name} entity={DRUG} widgets={DRUG_WIDGETS} />
      </SectionContainer>
    </PlatformApiProvider>
  );
}

export default Profile;
