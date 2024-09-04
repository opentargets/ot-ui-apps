import { Box, Chip, MenuItem, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { ReactElement, SyntheticEvent, useEffect, useReducer, useState } from "react";
import { Tooltip, useDebounce } from "ui";

import FACETS_SEARCH_QUERY from "./FacetsQuery.gql";
import useAotfContext from "../AssociationsToolkit/hooks/useAotfContext";
import client from "../../client";
import FacetsSuggestion from "./FacetsSuggestion";
import { resetFacets, selectFacet, setCategory, setFacetsData, setLoading } from "./facetsActions";
import { createInitialState, facetsReducer } from "./facetsReducer";
import { ALL_CATEGORY, Facet } from "./facets.types";
import { v1 } from "uuid";
import {
  FacetListItemCategory,
  FacetListItemContainer,
  FacetListItemLabel,
  FacetsAutocomplete,
  FacetsSelect,
} from "./facetsLayout";

function FacetsSearch(): ReactElement {
  const { entityToGet, facetFilterSelect, id } = useAotfContext();
  const [inputValue, setInputValue] = useState("");
  const debouncedInputValue = useDebounce(inputValue, 200);
  const [state, dispatch] = useReducer(facetsReducer, entityToGet, createInitialState);

  async function getFacetsData() {
    dispatch(setLoading(true));

    const variables = {
      queryString: inputValue,
      entityNames: [entityToGet],
    };

    const resData = await client.query({
      query: FACETS_SEARCH_QUERY,
      variables,
    });

    const filteredData = resData.data.facets.hits.filter(
      e =>
        e.category === state.categoryFilterValue ||
        state.categoryFilterValue === state.availableCategories[ALL_CATEGORY]
    );
    dispatch(setFacetsData(filteredData));
  }

  useEffect(() => {
    if (inputValue) getFacetsData();
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
          dispatch(setCategory(event.target.value));
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
        onChange={(event: SyntheticEvent, newValue: Facet) => {
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
        renderTags={(value: readonly string[], getTagProps) =>
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
        renderOption={(props, option: Facet) => {
          const { category, highlights } = option;
          return (
            <li {...props} key={v1()}>
              <FacetListItemContainer>
                <FacetListItemLabel>
                  <Typography dangerouslySetInnerHTML={{ __html: highlights[0] }}></Typography>
                </FacetListItemLabel>
                <FacetListItemCategory>
                  <Typography variant="caption">in {category}</Typography>
                </FacetListItemCategory>
              </FacetListItemContainer>
            </li>
          );
        }}
      />
    </Box>
  );
}
export default FacetsSearch;
