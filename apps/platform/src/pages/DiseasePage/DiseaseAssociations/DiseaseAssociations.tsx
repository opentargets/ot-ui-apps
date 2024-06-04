import { ReactElement } from "react";
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
import { ENTITY } from "../../../components/AssociationsToolkit/types";
import DISEASE_ASSOCIATIONS_QUERY from "./DiseaseAssociationsQuery.gql";

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
      <ControlsSection>
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          <SearhInput />
          <OptionsControlls>
            <AdvanceOptionsMenu />
            {/* <PrivateWrapper> */}
            <DataUploader />
            {/* </PrivateWrapper> */}
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
