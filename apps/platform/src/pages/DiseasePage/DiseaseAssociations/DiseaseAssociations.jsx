import { PrivateWrapper } from "ui";
import { Box, Divider } from "@mui/material";
import {
  TableAssociations,
  AdvanceOptionsMenu,
  TargetPrioritisationSwitch,
  AssociationsProvider,
  SearhInput,
  DataDownloader,
  ControlsSection,
  OptionsControlls,
  DataUploader,
  AotfApiPlayground,
} from "../../../components/AssociationsToolkit";
import { ENTITIES } from "../../../components/AssociationsToolkit/context/types";
import DISEASE_ASSOCIATIONS_QUERY from "./DiseaseAssociationsQuery.gql";

/* DISEASE ASSOCIATION  */
function DiseaseAssociations({ efoId }) {
  return (
    <AssociationsProvider id={efoId} entity={ENTITIES.DISEASE} query={DISEASE_ASSOCIATIONS_QUERY}>
      <ControlsSection>
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          <SearhInput />
          <OptionsControlls>
            <AdvanceOptionsMenu />
            <PrivateWrapper>
              <DataUploader />
            </PrivateWrapper>
            <Divider orientation="vertical" />
            <DataDownloader />
            <AotfApiPlayground />
          </OptionsControlls>
        </Box>
        <Box>
          <TargetPrioritisationSwitch />
        </Box>
      </ControlsSection>
      <TableAssociations />
    </AssociationsProvider>
  );
}

export default DiseaseAssociations;
