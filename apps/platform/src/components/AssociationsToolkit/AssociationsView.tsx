import { Box } from "@mui/material";
import type { DocumentNode } from "graphql";
import ActiveFiltersPanel from "./components/ActiveFiltersPanel";
import DataUploader from "./components/DataUploader";
import ExportMenu from "./components/ExportMenu";
import FacetsSearch from "./components/FacetsSearch";
import {
  AssociationsFocusProvider,
  AssociationsProvider,
  ColumnOptionsMenu,
  DisplayModeSwitch,
  TableAssociations,
} from "./index";
import type { ENTITY } from "./types";
import AnalysisMenu from "./components/AnalysisMenu";

interface AssociationsView {
  id: string;
  entity: ENTITY;
  query: DocumentNode;
}

const AssociationsView = ({ id, entity, query }: AssociationsView) => (
  <AssociationsProvider id={id} entity={entity} query={query}>
    <AssociationsFocusProvider>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: { xs: 2, lg: 2 },
          mt: 4,
          mb: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexDirection: { xs: "column", lg: "row" },
          }}
        >
          {/* <NameFilter /> */}
          <Box display="flex" sx={{ ml: -2 }}>
            <FacetsSearch />
            <ColumnOptionsMenu />
            <DataUploader />
            <ExportMenu />
            <AnalysisMenu />
          </Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "end" }}>
          <DisplayModeSwitch />
        </Box>
      </Box>
      <ActiveFiltersPanel />
      <TableAssociations />
    </AssociationsFocusProvider>
  </AssociationsProvider>
);

export default AssociationsView;
