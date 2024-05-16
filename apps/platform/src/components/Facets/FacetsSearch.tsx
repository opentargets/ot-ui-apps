import { Autocomplete, Box, Chip, Grid, TextField } from "@mui/material";
import { ReactElement, useEffect, useState } from "react";
import { Tooltip, useDebounce } from "ui";

import FACETS_SEARCH_QUERY from "./FacetsQuery.gql";
import useAotfContext from "../AssociationsToolkit/hooks/useAotfContext";
import client from "../../client";
import { capitalize } from "lodash";
import FacetsSuggestion from "./FacetsSuggestion";

function FacetsSearch(): ReactElement {
  const { entityToGet, setFacetFilterIds, facetFilterIds } = useAotfContext();
  const [inputValue, setInputValue] = useState("");
  const debouncedInputValue = useDebounce(inputValue, 400);
  const [dataOptions, setDataOptions] = useState([]);
  const [loading, setLoading] = useState(false);
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
    else setDataOptions([]);
  }, [debouncedInputValue]);

  return (
    <>
      <Autocomplete
        sx={{ minWidth: "300px", width: 4 / 7, maxWidth: 1, flexWrap: "nowrap" }}
        id="facets-search-input"
        multiple
        autoComplete
        includeInputInList
        filterSelectedOptions
        options={dataOptions}
        noOptionsText={<FacetsSuggestion />}
        size="small"
        loading={loading}
        // value={value}
        onChange={(event: any, newValue: any) => {
          setFacetFilterIds(newValue.map(v => v.id));
        }}
        // limitTags={3}
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
