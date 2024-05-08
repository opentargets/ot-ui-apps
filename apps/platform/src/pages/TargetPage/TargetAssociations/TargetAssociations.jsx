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
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          <FacetsSearch />
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
