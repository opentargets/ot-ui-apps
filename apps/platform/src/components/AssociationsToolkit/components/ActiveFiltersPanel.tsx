import { Box, Chip, Typography } from "@mui/material";
import { Tooltip } from "ui";
import useAotfContext from "../hooks/useAotfContext";
import { Facet } from "../../Facets/facetsTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faFileImport, faThumbtack } from "@fortawesome/free-solid-svg-icons";
import { setEntitySearch } from "../context/aotfActions";

function removeFacet(items: Facet[], idToRemove: string): Facet[] {
  return items.filter(item => item.id !== idToRemove);
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
  } = useAotfContext();

  const somePinned = pinnedEntries.length > 0;
  const someUploaded = uploadedEntries.length > 0;

  const showActiveFilter =
    facetFilters.length > 0 ||
    pinnedEntries.length > 0 ||
    uploadedEntries.length > 0 ||
    entitySearch;

  const onDelete = (id: string) => {
    const newState = removeFacet(facetFilters, id);
    facetFilterSelect(newState);
  };

  const setAllFilters = () => {
    if (somePinned) setPinnedEntries([]);
    if (someUploaded) setUploadedEntries([]);
    if (entitySearch) dispatch(setEntitySearch(""));
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
        <Tooltip title="Pinned entries" placement="bottom">
          <Box sx={{ maxWidth: "150px" }}>
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
                setPinnedEntries([]);
              }}
              size="small"
              label={
                <Box>
                  <FontAwesomeIcon icon={faThumbtack} size="sm" /> Pinned
                </Box>
              }
            />
          </Box>
        </Tooltip>
      )}
      {someUploaded && (
        <Tooltip title="Uploaded entries" placement="bottom">
          <Box sx={{ maxWidth: "150px" }}>
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
                setUploadedEntries([]);
              }}
              size="small"
              label={
                <Box sx={{ gap: 1 }}>
                  <FontAwesomeIcon icon={faFileImport} /> Uploaded
                </Box>
              }
            />
          </Box>
        </Tooltip>
      )}
      {entitySearch && (
        <Tooltip title="Name entity" placement="bottom">
          <Box sx={{ maxWidth: "150px" }}>
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
                dispatch(setEntitySearch(""));
              }}
              size="small"
              label={`"${entitySearch}"`}
            />
          </Box>
        </Tooltip>
      )}
      {facetFilters.map((facet: Facet) => (
        <Tooltip title={facet.label} key={facet.id} placement="bottom">
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
                  // borderColor: theme.palette.primary.dark,
                  // background: theme.palette.grey[700],
                  color: theme.palette.primary.dark,
                },
              })}
              onClick={setAllFilters}
            >
              <Typography sx={{ fontSize: "0.8125rem" }} variant="body2">
                Reset
              </Typography>
              {/* <FontAwesomeIcon icon={faTrash} size="xs" /> */}
              {/* <FontAwesomeIcon icon={faCircleXmark} size="xs" /> */}
            </Box>
          </Box>
        </Tooltip>
      )}
    </Box>
  );
}
export default ActiveFiltersPanel;
