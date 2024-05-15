import {
  Autocomplete,
  Box,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { ReactElement, useEffect, useState } from "react";
import { Tooltip, useDebounce } from "ui";

import FACETS_SEARCH_QUERY from "./FacetsQuery.gql";
import useAotfContext from "../AssociationsToolkit/hooks/useAotfContext";
import client from "../../client";
import { capitalize } from "lodash";

function FacetsSearch(): ReactElement {
  const { entityToGet, setFacetFilterIds, facetFilterIds } = useAotfContext();
  const [inputValue, setInputValue] = useState("");
  const debouncedInputValue = useDebounce(inputValue, 400);
  const [dataOptions, setDataOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterCategoryValue, setFilterCategoryValue] = useState("All");
  const [allCategory, setAllCategory] = useState([]);

  async function getFacetsData() {
    setLoading(true);
    const variables = {
      queryString: inputValue,
      entityNames: [entityToGet],
    };

    const resData = await client.query({
      query: FACETS_SEARCH_QUERY,
      variables,
    });

    const searchResultsWithCategory = [...resData.data.facets.hits];
    searchResultsWithCategory.sort((a, b) => -a.category.localeCompare(b.category));
    const categories = new Set(searchResultsWithCategory.map(item => item.category));
    setAllCategory(["All", ...categories]);
    setDataOptions(searchResultsWithCategory);
    setLoading(false);
  }

  function handleCategoryFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFilterCategoryValue((event.target as HTMLInputElement).value);
  }

  useEffect(() => {
    if (inputValue) getFacetsData();
  }, [debouncedInputValue]);

  return (
    <>
      <Autocomplete
        sx={{ minWidth: "300px", width: 4 / 7, maxWidth: 1, flexWrap: "nowrap" }}
        id="facets-search-input"
        multiple
        autoComplete
        includeInputInList
        loading={loading}
        loadingText={"loading"}
        filterSelectedOptions
        options={dataOptions}
        noOptionsText="Search for facets"
        size="small"
        limitTags={3}
        filterOptions={x => x}
        getOptionLabel={option => option?.label}
        groupBy={option => option.category}
        renderGroup={params => (
          <li key={params.key}>
            <Box>
              {Number(params.key) === 0 && (
                <Box
                  sx={{
                    textTransform: "uppercase",
                    color: theme => theme.palette.grey[600],
                    typography: "overline",
                    fontWeight: "bold",
                    mx: theme => theme.spacing(1),
                  }}
                >
                  <FormControl>
                    <RadioGroup
                      row
                      aria-labelledby="aotf-search-category-radio-button"
                      name="category-radio-buttons-group"
                      value={filterCategoryValue}
                      onChange={handleCategoryFilterChange}
                    >
                      {allCategory.map(e => (
                        <FormControlLabel key={e} value={e} control={<Radio />} label={e} />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Box>
              )}
              {(params.group === filterCategoryValue || filterCategoryValue === "All") && (
                <Box
                  sx={{
                    borderTop: theme => `1px solid ${theme.palette.grey[300]}`,
                  }}
                >
                  {params.children}
                </Box>
              )}
            </Box>
          </li>
        )}
        onChange={(event: any, newValue: any) => {
          setFacetFilterIds(newValue.map(v => v.id));
        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        renderInput={params => (
          <TextField {...params} label={`${capitalize(entityToGet)} specific filter`} fullWidth />
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
    </>
  );
}
export default FacetsSearch;
