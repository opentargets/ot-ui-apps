import { Box, Chip, Typography } from "@mui/material";
import { Tooltip } from "ui";
import useAotfContext from "../hooks/useAotfContext";
import { Facet } from "../../Facets/facetsTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faTrash, faX } from "@fortawesome/free-solid-svg-icons";

function removeFacet(items: Facet[], idToRemove: string): Facet[] {
  return items.filter(item => item.id !== idToRemove);
}

function ActiveFiltersPanel() {
  const {
    state: { facetFilters },
    facetFilterSelect,
  } = useAotfContext();

  const showActiveFilter = facetFilters.length > 0;

  const onDelete = (id: string) => {
    const newState = removeFacet(facetFilters, id);
    facetFilterSelect(newState);
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1,
        minHeight: "28px",
        alignItems: "center",
        mb: 2,
      }}
    >
      {showActiveFilter && <Typography variant="assoc_header">Active filters:</Typography>}
      {facetFilters.map((facet: Facet) => (
        <Tooltip title={facet.label} key={facet.id} style="" placement="bottom">
          <Box sx={{ maxWidth: "150px" }} key={facet.id}>
            <Chip
              sx={{
                borderRadius: 2,
                "& .MuiChip-label": {
                  mr: 1,
                },
                "& .MuiChip-deleteIcon": {
                  fontSize: "14px",
                },
              }}
              clickable
              deleteIcon={<FontAwesomeIcon icon={faCircleXmark} size="xs" />}
              onDelete={() => {
                onDelete(facet.id);
              }}
              size="small"
              label={facet.label}
              key={facet.id}
            />
          </Box>
        </Tooltip>
      ))}
    </Box>
  );
}
export default ActiveFiltersPanel;
