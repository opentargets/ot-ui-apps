import FacetsSearch from "../Facets/FacetsSearch";
import {
  TableAssociations,
  AdvanceOptionsMenu,
  AssociationsProvider,
  DataDownloader,
  DataUploader,
  AotfApiPlayground,
  AssociationsFocusProvider,
  DisplayModeSwitch,
  NameFilter,
} from "./index";
import { Box, Divider } from "@mui/material";

const AssociationsView = ({ id, entity, query }) => (
  <AssociationsProvider id={id} entity={entity} query={query}>
    <AssociationsFocusProvider>
      <>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            mt: 6,
            mb: 4,
          }}
        >
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            <NameFilter />
            <FacetsSearch />
            <AdvanceOptionsMenu />
            <DataUploader />
            <Divider orientation="vertical" flexItem />
            <DataDownloader />
            <AotfApiPlayground />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "end" }}>
            <DisplayModeSwitch />
          </Box>
        </Box>
        <TableAssociations />
      </>
    </AssociationsFocusProvider>
  </AssociationsProvider>
);

export default AssociationsView;
