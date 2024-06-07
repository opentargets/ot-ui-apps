import { useContext } from "react";
import { Box, Divider } from "@mui/material";
import {
  TableAssociations,
  AdvanceOptionsMenu,
  AssociationsContext,
  AssociationsProvider,
  SearhInput,
  DataDownloader,
  ControlsSection,
  OptionsControlls,
  AotFLoader,
  DataUploader,
  AotfApiPlayground,
} from "../../../components/AssociationsToolkit";
import TARGET_ASSOCIATIONS_QUERY from "./TargetAssociationsQuery.gql";

function AssociationsWrapper() {
  const { initialLoading } = useContext(AssociationsContext);

  if (initialLoading) return <AotFLoader />;

  return (
    <>
      <ControlsSection>
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          <SearhInput />
          <OptionsControlls>
            <AdvanceOptionsMenu />
            <DataUploader />
            <Divider orientation="vertical" />
            <DataDownloader />
            <AotfApiPlayground />
          </OptionsControlls>
        </Box>
        <Box></Box>
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
