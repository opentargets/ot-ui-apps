import { Box, Chip, MenuItem, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { ReactElement, useEffect, useReducer, useState } from "react";
import { Tooltip, useApolloClient, useDebounce } from "../../index";

import FacetsHelpBlock from "./FacetsHelpBlock";
import { resetFacets, selectFacet, setCategory, setFacetsData, setLoading } from "./facetsActions";
import { createInitialState, facetsReducer } from "./facetsReducer";
import { v1 } from "uuid";
import {
  FacetListItemCategory,
  FacetListItemContainer,
  FacetListItemLabel,
  FacetsAutocomplete,
  FacetsPopper,
  Select,
} from "./facetsLayout";
import { getFacetsData } from "./service/facetsService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { ENTITY, Facet } from "./facetsTypes";

function removeFacet(items: Facet[], idToRemove: string): Facet[] {
  return items.filter(item => item.id !== idToRemove);
}

type onFacetSelect = (f: Facet[]) => void;

interface FacetsSelectProps {
  id: string;
  entityToGet: ENTITY;
  parentState: Facet[];
  onFacetSelect: onFacetSelect;
  hideLegend?: boolean;
  hideActive?: boolean;
  placeholderText?: string;
}

function FacetsSelect({
  entityToGet,
  id,
  onFacetSelect,
  parentState,
  placeholderText,
  hideLegend = false,
  hideActive = false,
}: FacetsSelectProps): ReactElement {
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

  const onDelete = (id: string) => {
    const newState = removeFacet(parentState, id);
    onFacetSelect(newState);
  };

  useEffect(() => {
    if (inputValue) getFacetsQueryData();
    else dispatch(setFacetsData([]));
  }, [debouncedInputValue]);

  useEffect(() => {
    dispatch(resetFacets(entityToGet));
  }, [id]);

  const handleOptionSelect = (_, newValue) => {
    if (newValue) {
      if (!parentState.some(option => option.id === newValue.id)) {
        dispatch(selectFacet([newValue, ...parentState]));
        onFacetSelect([newValue, ...parentState]);
      }
      setValue(null);
      setInputValue("");
      setOptionsOpen(false);
    }
  };

  const facetAutocompletePlaceholder = placeholderText
    ? placeholderText
    : `Search ${entityToGet} filter`;

  return (
    <Box>
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
            <TextField {...params} label={facetAutocompletePlaceholder} fullWidth />
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
        <Select
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
        </Select>
      </Box>
      {!hideLegend && <FacetsHelpBlock entityToGet={entityToGet} />}
      {!hideActive && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {parentState.map((facet: Facet) => (
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
      )}
    </Box>
  );
}
export default FacetsSelect;
