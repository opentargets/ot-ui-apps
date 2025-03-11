import { Box, Chip, Typography } from "@mui/material";
import { Tooltip } from "ui";
import useAotfContext from "../hooks/useAotfContext";
import { Facet } from "../../Facets/facetsTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faFileImport,
  faGear,
  faThumbtack,
} from "@fortawesome/free-solid-svg-icons";
import { setEntitySearch } from "../context/aotfActions";

function removeFacet(items: Facet[], idToRemove: string): Facet[] {
  return items.filter(item => item.id !== idToRemove);
}

function FilterChip({ onDelete, label, tootltipContent, maxWidth = 150 }) {
  return (
    <Tooltip title={tootltipContent} placement="bottom">
      <Box sx={{ maxWidth: `${maxWidth}px` }}>
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
          deleteIcon={<FontAwesomeIcon icon={faCircleXmark} size="xs" />}
          onDelete={() => {
            onDelete();
          }}
          size="small"
          label={label}
        />
      </Box>
    </Tooltip>
  );
}

function ActiveFiltersPanel() {
  const {
    state: { facetFilters },
    facetFilterSelect,
    pinnedEntries,
    uploadedEntries,
    setPinnedEntries,
    setUploadedEntries,
    entitySearch,
    dispatch,
    modifiedSourcesDataControls,
    resetDatasourceControls,
  } = useAotfContext();

  const somePinned = pinnedEntries.length > 0;
  const someUploaded = uploadedEntries.length > 0;

  const showActiveFilter =
    facetFilters.length > 0 ||
    pinnedEntries.length > 0 ||
    uploadedEntries.length > 0 ||
    modifiedSourcesDataControls ||
    entitySearch;

  const onDelete = (id: string) => {
    const newState = removeFacet(facetFilters, id);
    facetFilterSelect(newState);
  };

  const setAllFilters = () => {
    if (somePinned) setPinnedEntries([]);
    if (someUploaded) setUploadedEntries([]);
    if (entitySearch) dispatch(setEntitySearch(""));
    if (modifiedSourcesDataControls) resetDatasourceControls();
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
      {showActiveFilter && (
        <Typography sx={{ fontWeight: "500" }} variant="body2">
          Active filters:
        </Typography>
      )}
      {somePinned && (
        <FilterChip
          tootltipContent="Pinned entries"
          onDelete={() => {
            setPinnedEntries([]);
          }}
          label={
            <Box>
              <FontAwesomeIcon icon={faThumbtack} size="sm" /> Pinned
            </Box>
          }
        />
      )}
      {someUploaded && (
        <FilterChip
          tootltipContent="Uploaded entries"
          onDelete={() => {
            setUploadedEntries([]);
          }}
          label={
            <Box sx={{ gap: 1 }}>
              <FontAwesomeIcon icon={faFileImport} /> Uploaded
            </Box>
          }
        />
      )}
      {entitySearch && (
        <FilterChip
          tootltipContent="Name entity"
          label={`"${entitySearch}"`}
          onDelete={() => {
            dispatch(setEntitySearch(""));
          }}
        />
      )}
      {modifiedSourcesDataControls && (
        <FilterChip
          tootltipContent="Reset Datasource controls"
          maxWidth={300}
          onDelete={() => {
            resetDatasourceControls();
          }}
          label={
            <Box sx={{ gap: 1 }}>
              <FontAwesomeIcon icon={faGear} /> Column options
            </Box>
          }
        />
      )}
      {facetFilters.map((facet: Facet) => (
        <FilterChip
          key={facet.id}
          tootltipContent={facet.label}
          label={facet.label}
          onDelete={() => {
            onDelete(facet.id);
          }}
        />
      ))}
      {showActiveFilter && (
        <Tooltip title="Reset all filters" placement="bottom">
          <Box>
            <Box
              sx={theme => ({
                display: "flex",
                alignItems: "center",
                py: 0.3,
                px: 1,
                border: ".9px solid",
                borderRadius: 2,
                borderColor: theme.palette.grey[400],
                cursor: "pointer",
                gap: 1,
                ":hover": {
                  boxShadow: theme.boxShadow.default,
                  color: theme.palette.primary.dark,
                },
              })}
              onClick={setAllFilters}
            >
              <Typography sx={{ fontSize: "0.8125rem" }} variant="body2">
                Reset
              </Typography>
            </Box>
          </Box>
        </Tooltip>
      )}
    </Box>
  );
}
export default ActiveFiltersPanel;
