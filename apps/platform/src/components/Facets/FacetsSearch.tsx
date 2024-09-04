import {
  Autocomplete,
  Box,
  Chip,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { ReactElement, useEffect, useReducer, useState } from "react";
import { Tooltip, useDebounce } from "ui";

import FACETS_SEARCH_QUERY from "./FacetsQuery.gql";
import useAotfContext from "../AssociationsToolkit/hooks/useAotfContext";
import client from "../../client";
import FacetsSuggestion from "./FacetsSuggestion";
import { resetFacets, selectFacet, setCategory, setFacetsData, setLoading } from "./facetsActions";
import { createInitialState, facetsReducer } from "./facetsReducer";
import { ALL_CATEGORY } from "./facets.types";
import { v1 } from "uuid";

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

    // dispatch(setFacetsData(resData.data.facets.hits));

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
    dispatch(resetFacets());
  }, [id]);

  return (
    <Box sx={{ display: "flex" }}>
      <Select
        value={state.categoryFilterValue}
        size="small"
        onChange={(event: SelectChangeEvent) => {
          console.log("0", event.target);
          dispatch(setCategory(event.target.value));
        }}
        sx={{
          minWidth: 150,
          maxWidth: 150,
          background: theme => `${theme.palette.grey[200]}`,
          display: "flex",
          boxShadow: "none",
          ".MuiOutlinedInput-notchedOutline": {
            borderRight: 0,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          },
        }}
      >
        {Object.entries(state.availableCategories).map(([key, value]) => (
          <MenuItem key={key} value={value}>
            {key}
          </MenuItem>
        ))}
      </Select>
      <Autocomplete
        sx={{
          minWidth: "280px",
          width: 1,
          maxWidth: 1,
          flexWrap: "nowrap",
          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderLeft: 0,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          },
        }}
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
        onChange={(event: any, newValue: any) => {
          dispatch(selectFacet(newValue));
          //TODO
          // facetFilterSelect(newValue);
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
              <Box sx={{ maxWidth: "150px" }}>
                <Chip size="small" label={option.label} {...getTagProps({ index })} />
              </Box>
            </Tooltip>
          ))
        }
        renderOption={(props, option) => {
          const { category, highlights } = option;
          return (
            <li {...props} key={v1()}>
              <Box
                sx={{
                  display: "flex",
                  p: 0,
                  m: 0,
                  width: "100%",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    w: 1,
                    flexWrap: "wrap",
                    justifyContent: "start",
                    em: {
                      fontWeight: "bold",
                      fontStyle: "normal",
                    },
                  }}
                >
                  <Typography dangerouslySetInnerHTML={{ __html: highlights[0] }}></Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <Box
                    sx={{
                      typography: "caption",
                      fontStyle: "italic",
                      fontWeight: "bold",
                      color: theme => theme.palette.primary.main,
                    }}
                  >
                    in {category}
                  </Box>
                </Box>
              </Box>
            </li>
          );
        }}
      />
    </Box>
  );
}
export default FacetsSearch;
