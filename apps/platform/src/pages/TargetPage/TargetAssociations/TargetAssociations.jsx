import { useContext } from "react";
import { PrivateWrapper } from "ui";
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
} from "../../../components/AssociationsToolkit";
import TARGET_ASSOCIATIONS_QUERY from "./TargetAssociationsQuery.gql";
import CopyUrlButton from "../../../components/AssociationsToolkit/CopyUrlButton";

function AssociationsWrapper() {
  const { initialLoading, id } = useContext(AssociationsContext);
  if (initialLoading) return <AotFLoader />;

  return (
    <>
      <ControlsSection>
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          <SearhInput />
          <OptionsControlls>
            <AdvanceOptionsMenu />
            <PrivateWrapper>
              <DataUploader />
            </PrivateWrapper>
            <Divider orientation="vertical" />
            <DataDownloader fileStem={`${id}-associated-targets`} />
            <CopyUrlButton />
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
