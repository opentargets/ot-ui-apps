import {
  Autocomplete,
  Box,
  Chip,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { ReactElement, useEffect, useState } from "react";
import { Tooltip, useDebounce } from "ui";

import FACETS_SEARCH_QUERY from "./FacetsQuery.gql";
import useAotfContext from "../AssociationsToolkit/hooks/useAotfContext";
import client from "../../client";
import { capitalize } from "lodash";
import FacetsSuggestion from "./FacetsSuggestion";

const CATEGORIES = {
  All: "All",
  Names: "Approved Name",
  Symbol: "Approved Symbol",
};

function FacetsSearch(): ReactElement {
  const { entityToGet, setFacetFilterIds, facetFilterIds } = useAotfContext();
  const [inputValue, setInputValue] = useState("");
  const debouncedInputValue = useDebounce(inputValue, 400);
  const [dataOptions, setDataOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryFilterValue, setCategoryFilterValue] = useState(CATEGORIES.All);
  // let my_data = [];

  async function getFacetsData() {
    setDataOptions([]);
    setLoading(true);

    const variables = {
      queryString: inputValue,
      entityNames: [entityToGet],
    };

    const resData = await client.query({
      query: FACETS_SEARCH_QUERY,
      variables,
    });

    setDataOptions(resData.data.facets.hits);
    setLoading(false);
  }

  useEffect(() => {
    if (inputValue) getFacetsData();
    // else setDataOptions([]);
  }, [debouncedInputValue]);

  return (
    <Box sx={{ display: "flex", width: 3 / 7, maxWidth: 3 / 7 }}>
      <Select
        value={categoryFilterValue}
        size="small"
        onChange={(event: SelectChangeEvent) => {
          setCategoryFilterValue(event.target.value);
        }}
        sx={{
          width: 110,
          background: theme => `${theme.palette.grey[200]}`,
          display: "flex",
          boxShadow: "none",
          ".MuiOutlinedInput-notchedOutline": {
            border: theme => `1px solid ${theme.palette.grey[400]}`,
            borderRight: 0,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          },
          ".MuiInputBase-input": {
            display: "flex",
            justifyContent: "center",
          },
        }}
      >
        {Object.entries(CATEGORIES).map(([key, value]) => (
          <MenuItem key={key} value={value}>
            {key}
          </MenuItem>
        ))}
      </Select>
      <Autocomplete
        sx={{
          // minWidth: "250px",
          width: 1,
          flexWrap: "nowrap",
          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: theme => `2px solid ${theme.palette.primary.main}`,
          },
          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            border: theme => `1px solid ${theme.palette.grey[400]}`,
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
        freeSolo
        options={dataOptions}
        noOptionsText={<FacetsSuggestion />}
        size="small"
        loading={loading}
        limitTags={2}
        // value={value}
        onChange={(event: any, newValue: any) => {
          setFacetFilterIds(newValue.map(v => v.id));
        }}
        filterOptions={x => x}
        getOptionLabel={option => option?.label}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        renderInput={params => (
          <TextField
            {...params}
            label={`Search ${capitalize(entityToGet)} specific filter`}
            fullWidth
          />
        )}
        renderTags={(value: readonly string[], getTagProps) =>
          value.map((option: any, index: number) => (
            <Tooltip title={option.label} key={option.id}>
              <Box sx={{ maxWidth: "150px" }}>
                <Chip size="small" label={option.label} {...getTagProps({ index })} />
              </Box>
            </Tooltip>
          ))
        }
        renderOption={(props, option) => {
          const { label, category } = option;
          if (option.category === categoryFilterValue || categoryFilterValue === CATEGORIES.All)
            return (
              <li {...props}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Box sx={{ pr: theme => theme.spacing(2) }}>{label}</Box>
                  <Box>
                    <Chip label={category} color="primary" size="small" />
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
