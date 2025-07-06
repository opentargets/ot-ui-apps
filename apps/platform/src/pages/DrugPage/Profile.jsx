import { PlatformApiProvider, SectionContainer, SummaryContainer, SectionsRenderer, SummaryRenderer } from "ui";
import ProfileHeader from "./ProfileHeader";
import { DRUG_PROFILE_QUERY, drugProfileWidgets, drugProfileWidgetsSummaries } from "./ProfileWidgets";

const DRUG = "drug";

const DRUG_WIDGETS = Array.from(drugProfileWidgets.values());

function Profile({ chemblId, name }) {
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
