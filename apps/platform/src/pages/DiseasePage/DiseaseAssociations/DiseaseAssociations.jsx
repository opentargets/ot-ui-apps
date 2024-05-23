import { PrivateWrapper } from "ui";
import { Box, Divider } from "@mui/material";
import {
  TableAssociations,
  AdvanceOptionsMenu,
  TargetPrioritisationSwitch,
  AssociationsProvider,
  SearhInput,
  DataDownloader,
  useAotfContext,
  ControlsSection,
  OptionsControlls,
  AotFLoader,
  DataUploader,
  AotfApiPlayground,
} from "../../../components/AssociationsToolkit";
import DISEASE_ASSOCIATIONS_QUERY from "./DiseaseAssociationsQuery.gql";

function AssociationsWrapper() {
  const { initialLoading, id } = useAotfContext();

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
            <DataDownloader />
            <AotfApiPlayground />
          </OptionsControlls>
        </Box>
        <Box>
          <TargetPrioritisationSwitch />
        </Box>
      </ControlsSection>
      <TableAssociations />
    </>
  );
}

/* DISEASE ASSOCIATION  */
function DiseaseAssociations({ efoId }) {
  return (
    <AssociationsProvider id={efoId} entity="disease" query={DISEASE_ASSOCIATIONS_QUERY}>
      <AssociationsWrapper />
    </AssociationsProvider>
  );
}

export default DiseaseAssociations;
