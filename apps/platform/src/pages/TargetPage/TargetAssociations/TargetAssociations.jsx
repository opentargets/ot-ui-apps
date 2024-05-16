import { useContext } from "react";
import { PrivateWrapper } from "ui";
import { Box, Divider } from "@mui/material";
import {
  TableAssociations,
  AdvanceOptionsMenu,
  AssociationsContext,
  AssociationsProvider,
  DataDownloader,
  ControlsSection,
  OptionsControlls,
  AotFLoader,
  DataUploader,
  AotfApiPlayground,
} from "../../../components/AssociationsToolkit";
import TARGET_ASSOCIATIONS_QUERY from "./TargetAssociationsQuery.gql";
import FacetsSearch from "../../../components/Facets/FacetsSearch";

function AssociationsWrapper() {
  const { initialLoading } = useContext(AssociationsContext);

  if (initialLoading) return <AotFLoader />;

  return (
    <>
      <ControlsSection>
        <Box sx={{ flex: 1, display: "flex", flexWrap: "wrap", gap: "12px" }}>
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
    </>
  );
}

/* TARGET ASSOCIATION  */
function TargetAssociations({ ensgId }) {
  return (
    <AssociationsProvider id={ensgId} entity="target" query={TARGET_ASSOCIATIONS_QUERY}>
      <AssociationsWrapper />
    </AssociationsProvider>
  );
}

export default TargetAssociations;
