import { Box, Divider } from "@mui/material";
import {
  TableAssociations,
  AdvanceOptionsMenu,
  TargetPrioritisationSwitch,
  AssociationsProvider,
  DataDownloader,
  useAotfContext,
  ControlsSection,
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
        <Box sx={{ flex: 2, display: "flex", flexWrap: "wrap", gap: "12px" }}>
          <FacetsSearch />
          <AdvanceOptionsMenu />
          <DataUploader />
          <Divider orientation="vertical" />
          <DataDownloader />
          <AotfApiPlayground />
        </Box>
        <Box sx={{ flex: 1, display: "flex", justifyContent: "end" }}>
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
