import { ReactElement } from "react";
import { Box, Divider } from "@mui/material";
import {
  TableAssociations,
  AdvanceOptionsMenu,
  TargetPrioritisationSwitch,
  AssociationsProvider,
  DataDownloader,
  ControlsSection,
  DataUploader,
  AotfApiPlayground,
  AssociationsFocusProvider,
} from "../../../components/AssociationsToolkit";
import { ENTITY } from "../../../components/AssociationsToolkit/types";
import DISEASE_ASSOCIATIONS_QUERY from "./DiseaseAssociationsQuery.gql";
import FacetsSearch from "../../../components/Facets/FacetsSearch";

type DiseaseAssociationsProps = {
  efoId: string;
};

function DiseaseAssociations(pros: DiseaseAssociationsProps): ReactElement {
  return (
    <AssociationsProvider
      id={pros.efoId}
      entity={ENTITY.DISEASE}
      query={DISEASE_ASSOCIATIONS_QUERY}
    >
      <AssociationsFocusProvider>
        <>
          <ControlsSection>
            <Box sx={{ flex: 2, display: "flex", flexWrap: "wrap", gap: 2 }}>
              <FacetsSearch />
              <AdvanceOptionsMenu />
              <DataUploader />
              <Divider orientation="vertical" flexItem />
              <DataDownloader />
              <AotfApiPlayground />
            </Box>
            <Box sx={{ flex: 1, display: "flex", justifyContent: "end" }}>
              <TargetPrioritisationSwitch />
            </Box>
          </ControlsSection>
          <TableAssociations />
        </>
      </AssociationsFocusProvider>
    </AssociationsProvider>
  );
}

export default DiseaseAssociations;
