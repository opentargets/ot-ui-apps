import {
  Box,
  Button,
  Chip,
  Divider,
  MenuItem,
  Popover,
  SelectChangeEvent,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { ReactElement, useEffect, useReducer, useState, MouseEvent } from "react";
import { Tooltip, useApolloClient, useDebounce } from "ui";

import useAotfContext from "../AssociationsToolkit/hooks/useAotfContext";
import FacetsSuggestion from "./FacetsSuggestion";
import { resetFacets, selectFacet, setCategory, setFacetsData, setLoading } from "./facetsActions";
import { createInitialState, facetsReducer } from "./facetsReducer";
import { v1 } from "uuid";
import {
  FacetListItemCategory,
  FacetListItemContainer,
  FacetListItemLabel,
  FacetsAutocomplete,
  FacetsPopper,
  FacetsSelect,
} from "./facetsLayout";
import { getFacetsData } from "./service/facetsService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp, faCircleXmark, faFilter } from "@fortawesome/free-solid-svg-icons";
import { Facet } from "./facetsTypes";
import { DataUploader } from "../AssociationsToolkit";

const FilterButton = styled(Button)({
  border: "none",
  "& .MuiButton-startIcon": {
    fontSize: "14px !important",
  },
});

function removeFacet(items: Facet[], idToRemove: string): Facet[] {
  return items.filter(item => item.id !== idToRemove);
}

function FacetsSearch(): ReactElement {
  const {
    entityToGet,
    facetFilterSelect,
    id,
    state: { facetFilters },
  } = useAotfContext();
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState(null);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const debouncedInputValue = useDebounce(inputValue, 200);
  const [state, dispatch] = useReducer(facetsReducer, entityToGet, createInitialState);

  const client = useApolloClient();

  function setFacetsCategory(category: string) {
    dispatch(setLoading(true));
    if (category === "All") {
      return dispatch(setCategory(category, []));
    }
    const facetData = getFacetsData("*", entityToGet, category, client);
    facetData.then(data => {
      dispatch(setCategory(category, data));
    });
  }

  function getFacetsQueryData() {
    dispatch(setLoading(true));
    const facetData = getFacetsData(inputValue, entityToGet, state.categoryFilterValue, client);
    facetData.then(data => {
      dispatch(setFacetsData(data));
    });
  }

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onDelete = (id: string) => {
    const newState = removeFacet(facetFilters, id);
    facetFilterSelect(newState);
  };

  const open = Boolean(anchorEl);
  const popoverId = open ? "simple-popover" : undefined;

  useEffect(() => {
    if (inputValue) getFacetsQueryData();
    else dispatch(setFacetsData([]));
  }, [debouncedInputValue]);

  useEffect(() => {
    dispatch(resetFacets(entityToGet));
  }, [id]);

  const handleOptionSelect = (event, newValue) => {
    if (newValue) {
      // Check if the option is already selected to prevent duplicates
      if (!facetFilters.some(option => option.id === newValue.id)) {
        dispatch(selectFacet([newValue, ...facetFilters]));
        facetFilterSelect([newValue, ...facetFilters]);
      }
      // Clear both the value and
      setValue(null);
      setInputValue("");
      // Force-close the dropdown after selection
      setOptionsOpen(false);
    }
  };

  return (
    <Box>
      <FilterButton
        aria-describedby={popoverId}
        variant="text"
        onClick={handleClick}
        sx={{ height: 1 }}
      >
        <Box component="span" sx={{ mr: 1 }}>
          <FontAwesomeIcon icon={faFilter} />
        </Box>
        Advanced filters
        <Box component="span" sx={{ ml: 1 }}>
          {open ? <FontAwesomeIcon icon={faCaretUp} /> : <FontAwesomeIcon icon={faCaretDown} />}
        </Box>
      </FilterButton>
      <Popover
        id={popoverId}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        disableScrollLock
        elevation={1}
      >
        <Box sx={{ width: "450px", display: "flex", p: 3, flexDirection: "column", gap: 2 }}>
          <DataUploader parentAction={handleClose} />

          <Divider flexItem sx={{ my: 1 }} />
          <Box sx={{ display: "flex" }}>
            <FacetsAutocomplete
              id="facets-search-input"
              size="small"
              noOptionsText="Type to search..."
              value={value}
              open={optionsOpen}
              inputValue={inputValue}
              loading={state.loading}
              options={state.dataOptions}
              filterOptions={x => x}
              getOptionLabel={option => option?.label}
              isOptionEqualToValue={(option, value) => option.id === value?.id}
              onOpen={() => setOptionsOpen(true)}
              onClose={() => setOptionsOpen(false)}
              onChange={handleOptionSelect}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
              }}
              PopperComponent={FacetsPopper}
              renderInput={params => (
                <TextField {...params} label={`Search ${entityToGet} filter`} fullWidth />
              )}
              renderOption={(props, option) => (
                <li {...props} key={v1()}>
                  <FacetListItemContainer>
                    <FacetListItemLabel>
                      <Typography
                        variant="body2"
                        dangerouslySetInnerHTML={{ __html: option.highlights[0] || option.label }}
                      ></Typography>
                    </FacetListItemLabel>
                    <FacetListItemCategory>
                      <Typography variant="caption">in {option.category}</Typography>
                    </FacetListItemCategory>
                  </FacetListItemContainer>
                </li>
              )}
            />
            <FacetsSelect
              aria-label="Facet filter"
              value={state.categoryFilterValue}
              size="small"
              onChange={(event: SelectChangeEvent) => {
                setFacetsCategory(event.target.value);
              }}
            >
              {Object.entries(state.availableCategories).map(([key, value]) => (
                <MenuItem key={key} value={value}>
                  {key}
                </MenuItem>
              ))}
            </FacetsSelect>
          </Box>
          <FacetsSuggestion />
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
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
        </Box>
      </Popover>
    </Box>
  );
}
export default FacetsSearch;
