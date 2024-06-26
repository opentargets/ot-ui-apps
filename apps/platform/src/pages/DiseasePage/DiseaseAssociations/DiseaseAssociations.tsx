import { ReactElement } from "react";
import { Box, Divider } from "@mui/material";
import { usePermissions } from "ui";
import {
  TableAssociations,
  AdvanceOptionsMenu,
  TargetPrioritisationSwitch,
  AssociationsProvider,
  DataDownloader,
  ControlsSection,
  DataUploader,
  AotfApiPlayground,
  SearchInput,
} from "../../../components/AssociationsToolkit";
import { ENTITY } from "../../../components/AssociationsToolkit/types";
import DISEASE_ASSOCIATIONS_QUERY from "./DiseaseAssociationsQuery.gql";
import FacetsSearch from "../../../components/Facets/FacetsSearch";

type DiseaseAssociationsProps = {
  efoId: string;
};

function DiseaseAssociations(pros: DiseaseAssociationsProps): ReactElement {
  const { isPartnerPreview } = usePermissions();
  return (
    <AssociationsProvider
      id={pros.efoId}
      entity={ENTITY.DISEASE}
      query={DISEASE_ASSOCIATIONS_QUERY}
    >
      <ControlsSection>
        <Box sx={{ flex: 2, display: "flex", flexWrap: "wrap", gap: theme => theme.spacing(2) }}>
          {isPartnerPreview && <FacetsSearch />}
          {!isPartnerPreview && <SearchInput />}
          <AdvanceOptionsMenu />
          <DataUploader />
          <Divider orientation="vertical" />
          <DataDownloader />
          <AotfApiPlayground />
        </Box>
        <Box sx={{ flex: 1, display: "flex", justifyContent: "end" }}>
          <TargetPrioritisationSwitch />
        </Box>
      </ControlsSection>
      <TableAssociations />
    </AssociationsProvider>
  );
}

export default DiseaseAssociations;
