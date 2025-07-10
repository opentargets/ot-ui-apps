import { gql } from "@apollo/client";
import {
  PlatformApiProvider,
  SectionContainer,
  SummaryContainer,
  SectionsRenderer,
  SummaryRenderer,
  summaryUtils,
} from "ui";
import { Disease, Widget } from "sections";

import ProfileHeader from "./ProfileHeader";

const diseaseProfileWidgets = new Map<string, Widget>([
  [Disease.Ontology.definition.id, Disease.Ontology],
  [Disease.KnownDrugs.definition.id, Disease.KnownDrugs],
  [Disease.Phenotypes.definition.id, Disease.Phenotypes],
  [Disease.OTProjects.definition.id, Disease.OTProjects],
  [Disease.GWASStudies.definition.id, Disease.GWASStudies],
  [Disease.Bibliography.definition.id, Disease.Bibliography],
]);

const DISEASE_WIDGETS = Array.from(diseaseProfileWidgets.values());

const diseaseProfileWidgetsSummaries = Array.from(diseaseProfileWidgets.values()).map(
  widget => widget.Summary
);

const DISEASE = "disease";
const DISEASE_PROFILE_SUMMARY_FRAGMENT = summaryUtils.createSummaryFragment(
  diseaseProfileWidgetsSummaries,
  "Disease"
);

const DISEASE_PROFILE_QUERY = gql`
  query DiseaseProfileQuery($efoId: String!) {
    disease(efoId: $efoId) {
      id
      ...DiseaseProfileHeaderFragment
      ...DiseaseProfileSummaryFragment
    }
    studies(diseaseIds: [$efoId], page: { size: 1, index: 0 }) {
      count
    }
  }
  ${ProfileHeader.fragments.profileHeader}
  ${DISEASE_PROFILE_SUMMARY_FRAGMENT}
`;

function Profile({ efoId, name }: { efoId: string; name: string }) {
  return (
    <PlatformApiProvider
      entity={DISEASE}
      query={DISEASE_PROFILE_QUERY}
      variables={{
        efoId,
      }}
    >
      <ProfileHeader />
      <SummaryContainer>
        <SummaryRenderer widgets={DISEASE_WIDGETS} />
      </SummaryContainer>

      <SectionContainer>
        <SectionsRenderer id={efoId} label={name} entity={DISEASE} widgets={DISEASE_WIDGETS} />
      </SectionContainer>
    </PlatformApiProvider>
  );
}

export default Profile;
