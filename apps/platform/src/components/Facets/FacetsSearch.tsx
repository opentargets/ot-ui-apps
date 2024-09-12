import { Box, Chip, MenuItem, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { ReactElement, useEffect, useReducer, useState } from "react";
import { Tooltip, useDebounce } from "ui";

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
  FacetsSelect,
} from "./facetsLayout";
import { getFacetsData } from "./service/facetsService";

function FacetsSearch(): ReactElement {
  const { entityToGet, facetFilterSelect, id } = useAotfContext();
  const [inputValue, setInputValue] = useState("");
  const debouncedInputValue = useDebounce(inputValue, 200);
  const [state, dispatch] = useReducer(facetsReducer, entityToGet, createInitialState);

  function setFacetsCategory(category: string) {
    dispatch(setLoading(true));
    if (category === "All") {
      return dispatch(setCategory(category, []));
    }
    const facetData = getFacetsData("*", entityToGet, category);
    facetData.then(data => {
      dispatch(setCategory(category, data));
    });
  }

  function getFacetsQueryData() {
    dispatch(setLoading(true));
    const facetData = getFacetsData(inputValue, entityToGet, state.categoryFilterValue);
    facetData.then(data => {
      dispatch(setFacetsData(data));
    });
  }

  useEffect(() => {
    if (inputValue) getFacetsQueryData();
    else dispatch(setFacetsData([]));
  }, [debouncedInputValue]);

  useEffect(() => {
    dispatch(resetFacets(entityToGet));
  }, [id]);

  return (
    <Box sx={{ display: "flex" }}>
      <FacetsSelect
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
      <FacetsAutocomplete
        id="facets-search-input"
        multiple
        autoComplete
        includeInputInList
        filterSelectedOptions
        options={state.dataOptions}
        value={state.selectedFacets}
        noOptionsText={<FacetsSuggestion />}
        loading={state.loading}
        size="small"
        limitTags={2}
        onChange={(event, newValue) => {
          dispatch(selectFacet(newValue));
          facetFilterSelect(newValue);
        }}
        filterOptions={x => x}
        getOptionLabel={option => option?.label}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        renderInput={params => (
          <TextField {...params} label={`Search ${entityToGet} filter (beta)`} fullWidth />
        )}
        renderTags={(value, getTagProps) =>
          value.map((option: any, index: number) => (
            <Tooltip title={option.label} key={option.id} style="">
              <Box sx={{ maxWidth: "150px" }} key={option.id}>
                <Chip
                  size="small"
                  label={option.label}
                  {...getTagProps({ index })}
                  key={option.id}
                />
              </Box>
            </Tooltip>
          ))
        }
        renderOption={(props, option) => (
          <li {...props} key={v1()}>
            <FacetListItemContainer>
              <FacetListItemLabel>
                <Typography
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
    </Box>
  );
}
export default FacetsSearch;
