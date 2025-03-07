import FacetsSearch from "../Facets/FacetsSearch";
import ExportMenu from "./components/ExportMenu";
import {
  TableAssociations,
  AdvanceOptionsMenu,
  AssociationsProvider,
  DataDownloader,
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
            mt: 4,
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <NameFilter />
            <Box sx={{ display: "flex" }}>
              <FacetsSearch />
              <AdvanceOptionsMenu />
              <ExportMenu />
            </Box>
            {/* <DataUploader /> */}
            {/* <DataDownloader /> */}
            {/* <AotfApiPlayground /> */}
          </Box>
          <Box sx={{ display: "flex", justifyContent: "end" }}>
            <DisplayModeSwitch />
            {/* <Divider orientation="vertical" flexItem /> */}
          </Box>
        </Box>

        <TableAssociations />
      </>
    </AssociationsFocusProvider>
  </AssociationsProvider>
);

export default AssociationsView;
