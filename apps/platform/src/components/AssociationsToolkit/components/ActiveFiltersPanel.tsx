import { Box, Chip, Typography } from "@mui/material";
import { Tooltip } from "ui";
import useAotfContext from "../hooks/useAotfContext";
import { Facet } from "../../Facets/facetsTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDownWideShort,
  faCircleXmark,
  faFileImport,
  faGear,
  faThumbtack,
} from "@fortawesome/free-solid-svg-icons";

import { setEntitySearch } from "../context/aotfActions";
import dataSources from "../static_datasets/dataSourcesAssoc";

function removeFacet(items: Facet[], idToRemove: string): Facet[] {
  return items.filter(item => item.id !== idToRemove);
}

function FilterChip({ onDelete, label, tootltipContent, maxWidth = 150, testId }) {
  return (
    <Tooltip title={tootltipContent} placement="bottom">
      <Box sx={{ maxWidth: `${maxWidth}px` }}>
        <Chip
          data-testid={testId}
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
    sorting,
    resetSorting,
  } = useAotfContext();

  const somePinned = pinnedEntries.length > 0;
  const someUploaded = uploadedEntries.length > 0;
  const someFacetFilters = facetFilters.length > 0;
  const tableSorted = sorting[0].id !== "score";
  const modifiedEntitySearch = entitySearch !== "";

  const filterCategories = [
    someFacetFilters,
    somePinned,
    someUploaded,
    tableSorted,
    modifiedSourcesDataControls,
    modifiedEntitySearch,
  ];

  const showActiveFilter = filterCategories.some(x => x === true);
  const multipleFiltersOn = filterCategories.filter(x => x === true).length > 1;

  const onDelete = (id: string) => {
    const newState = removeFacet(facetFilters, id);
    facetFilterSelect(newState);
  };

  const setAllFilters = () => {
    if (somePinned) setPinnedEntries([]);
    if (someUploaded) setUploadedEntries([]);
    if (entitySearch) dispatch(setEntitySearch(""));
    if (modifiedSourcesDataControls) resetDatasourceControls();
    if (facetFilters.length > 0) facetFilterSelect([]);
    if (tableSorted) resetSorting();
  };

  return (
    <Box
      data-testid="active-filters-panel"
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1,
        minHeight: "28px",
        alignItems: "center",
        mb: 2,
      }}
    >
      {entitySearch && (
        <FilterChip
          testId="active-filter-chip-entity-search"
          tootltipContent="Name entity"
          label={`"${entitySearch}"`}
          onDelete={() => {
            dispatch(setEntitySearch(""));
          }}
        />
      )}
      {facetFilters.map((facet: Facet) => (
        <FilterChip
          key={facet.id}
          testId={`active-filter-chip-${facet.id}`}
          tootltipContent={facet.label}
          label={facet.label}
          onDelete={() => {
            onDelete(facet.id);
          }}
        />
      ))}
      {modifiedSourcesDataControls && (
        <FilterChip
          testId="active-filter-chip-column-options"
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
      {tableSorted && (
        <FilterChip
          testId="active-filter-chip-sort"
          maxWidth={300}
          tootltipContent="Reset sorting"
          onDelete={() => {
            resetSorting();
          }}
          label={
            <Box sx={{ gap: 1 }}>
              <FontAwesomeIcon icon={faArrowDownWideShort} />{" "}
              {dataSources.find(d => d.id === sorting[0].id)?.label}
            </Box>
          }
        />
      )}
      {somePinned && (
        <FilterChip
          testId="active-filter-chip-pinned"
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
          testId="active-filter-chip-uploaded"
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

      {showActiveFilter && (
        <Tooltip title="Reset all filters" placement="bottom">
          <Box>
            <Box
              data-testid="clear-all-filters-button"
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
                Clear {multipleFiltersOn ? "all" : ""}
              </Typography>
            </Box>
          </Box>
        </Tooltip>
      )}
    </Box>
  );
}
export default ActiveFiltersPanel;
