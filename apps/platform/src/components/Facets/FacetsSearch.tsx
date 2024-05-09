import { Autocomplete, Box, Chip, Grid, TextField } from "@mui/material";
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
  const NON_FACETS_CATEGORIES = ["Approved Name", "Approved Symbol", "Reactome"];
  // let my_data = [];

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

    const searchResultsWithCategory = resData.data.facets.hits.map(e => {
      const obj = { ...e };
      if (NON_FACETS_CATEGORIES.indexOf(e.category) >= 0) obj.filterCategory = "Others";
      else obj.filterCategory = "Facets";
      return obj;
    });
    searchResultsWithCategory.sort((a, b) => -b.filterCategory.localeCompare(a.filterCategory));

    setDataOptions(searchResultsWithCategory);
    setLoading(false);
  }

  useEffect(() => {
    if (inputValue) getFacetsData();
  }, [debouncedInputValue]);

  return (
    <>
      <Autocomplete
        sx={{ width: 1, maxWidth: 1, flexWrap: "nowrap" }}
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
        groupBy={option => option.filterCategory}
        renderGroup={params => (
          <li key={params.key}>
            <Box
              sx={{
                borderBottomWidth: "1px",
                borderStyle: "solid",
                borderImage: "linear-gradient(to right, white, #00000037, white)0 0 90",
              }}
            >
              <Box
                sx={{
                  textTransform: "uppercase",
                  color: theme => theme.palette.grey[600],
                  typography: "overline",
                  fontWeight: "bold",
                  mx: theme => theme.spacing(1),
                }}
              >
                {params.group}
              </Box>
              {params.children}
            </Box>
          </li>
        )}
        // getOptionLabel={(option) => option.title}
        // value={value}
        onChange={(event: any, newValue: any) => {
          setFacetFilterIds(newValue.map(v => v.id));
        }}
        limitTags={2}
        filterOptions={x => x}
        getOptionLabel={option => option?.label}
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
