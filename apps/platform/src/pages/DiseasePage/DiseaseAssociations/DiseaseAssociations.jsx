import { PrivateWrapper } from "ui";
import { Box, Divider } from "@mui/material";
import {
  TableAssociations,
  AdvanceOptionsMenu,
  TargetPrioritisationSwitch,
  AssociationsProvider,
  DataDownloader,
  useAotfContext,
  ControlsSection,
  OptionsControlls,
  AotFLoader,
  DataUploader,
  AotfApiPlayground,
} from "../../../components/AssociationsToolkit";
import DISEASE_ASSOCIATIONS_QUERY from "./DiseaseAssociationsQuery.gql";
import FacetsSearch from "../../../components/Facets/FacetsSearch";

function AssociationsWrapper() {
  const { initialLoading } = useAotfContext();

  if (initialLoading) return <AotFLoader />;

  return (
    <>
      <ControlsSection>
        <Box sx={{ flex: 1, display: "flex", justifyContent: "start" }}>
          <FacetsSearch />
          <AdvanceOptionsMenu />
        </Box>
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <TargetPrioritisationSwitch />
        </Box>
        <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end", gap: "5px" }}>
          <DataUploader />
          <DataDownloader />
          <AotfApiPlayground />
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
