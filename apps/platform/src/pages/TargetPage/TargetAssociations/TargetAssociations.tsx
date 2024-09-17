import { ReactElement } from "react";
import { Box, Divider } from "@mui/material";
import {
  TableAssociations,
  AdvanceOptionsMenu,
  AssociationsProvider,
  DataDownloader,
  ControlsSection,
  DataUploader,
  AotfApiPlayground,
  AssociationsFocusProvider,
  InfoTooltip,
} from "../../../components/AssociationsToolkit";
import { ENTITY } from "../../../components/AssociationsToolkit/types";
import TARGET_ASSOCIATIONS_QUERY from "./TargetAssociationsQuery.gql";
import FacetsSearch from "../../../components/Facets/FacetsSearch";

type TargetAssociationsProps = {
  ensgId: string;
};

function TargetAssociations({ ensgId }: TargetAssociationsProps): ReactElement {
  return (
    <AssociationsProvider id={ensgId} entity={ENTITY.TARGET} query={TARGET_ASSOCIATIONS_QUERY}>
      <AssociationsFocusProvider>
        <>
          <ControlsSection>
            <Box sx={{ flex: 2, display: "flex", flexWrap: "wrap", gap: 2 }}>
              <FacetsSearch />
              <InfoTooltip />
              <Divider orientation="vertical" flexItem />
              <AdvanceOptionsMenu />
              <DataUploader />
              <DataDownloader />
              <AotfApiPlayground />
            </Box>
            <Box sx={{ flex: 1, display: "flex" }}></Box>
          </ControlsSection>
          <TableAssociations />
        </>
      </AssociationsFocusProvider>
    </AssociationsProvider>
  );
}

export default TargetAssociations;
