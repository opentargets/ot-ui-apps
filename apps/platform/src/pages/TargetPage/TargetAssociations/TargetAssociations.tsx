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
      <ControlsSection>
        <Box sx={{ flex: 2, display: "flex", flexWrap: "wrap", gap: theme => theme.spacing(2) }}>
          <FacetsSearch />
          <AdvanceOptionsMenu />
          <DataUploader />
          <Divider orientation="vertical" />
          <DataDownloader />
          <AotfApiPlayground />
        </Box>
        <Box sx={{ flex: 1, display: "flex" }}></Box>
      </ControlsSection>
      <TableAssociations />
    </AssociationsProvider>
  );
}

export default TargetAssociations;
