import FacetsSearch from "../Facets/FacetsSearch";
import ExportMenu from "./components/ExportMenu";
import {
  TableAssociations,
  ColumnOptionsMenu,
  AssociationsProvider,
  AssociationsFocusProvider,
  DisplayModeSwitch,
  NameFilter,
} from "./index";
import { Box } from "@mui/material";
import { ENTITY } from "./types";
import { DocumentNode } from "graphql";
import ActiveFiltersPanel from "./components/ActiveFiltersPanel";

interface AssociationsView {
  id: string;
  entity: ENTITY;
  query: DocumentNode;
}

const AssociationsView = ({ id, entity, query }: AssociationsView) => (
  <AssociationsProvider id={id} entity={entity} query={query}>
    <AssociationsFocusProvider>
      <>
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
            <NameFilter />
            <Box display="flex">
              <FacetsSearch />
              <ColumnOptionsMenu />
              <ExportMenu />
            </Box>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "end" }}>
            <DisplayModeSwitch />
          </Box>
        </Box>
        <ActiveFiltersPanel />
        <TableAssociations />
      </>
    </AssociationsFocusProvider>
  </AssociationsProvider>
);

export default AssociationsView;
