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
import { ReactElement, useEffect, useState } from "react";
import { Tooltip, useDebounce } from "ui";

import FACETS_SEARCH_QUERY from "./FacetsQuery.gql";
import useAotfContext from "../AssociationsToolkit/hooks/useAotfContext";
import client from "../../client";
import FacetsSuggestion from "./FacetsSuggestion";

const TARGET_CATEGORIES = {
  "All Categories": "All",
  Names: "Approved Name",
  Symbol: "Approved Symbol",
  "ChEMBL Target Class": "ChEMBL Target Class",
  "GO:BP": "GO:BP",
  "GO:CC": "GO:CC",
  "GO:MF": "GO:MF",
  Reactome: "Reactome",
  "Subcellular Location": "Subcellular Location",
  "Target ID": "Target ID",
  "Tractability Antibody": "Tractability Antibody",
  "Tractability Other Modalities": "Tractability Other Modalities",
  "Tractability PROTAC": "Tractability PROTAC",
  "Tractability Small Molecule": "Tractability Small Molecule",
};

const DISEASE_CATEGORIES = {
  "All Categories": "All",
  Disease: "Disease",
  "Therapeutic Area": "Therapeutic Area",
};

function FacetsSearch(): ReactElement {
  const { entityToGet, setFacetFilterIds } = useAotfContext();
  const [inputValue, setInputValue] = useState("");
  const debouncedInputValue = useDebounce(inputValue, 400);
  const [dataOptions, setDataOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const CATEGORIES = entityToGet === "disease" ? DISEASE_CATEGORIES : TARGET_CATEGORIES;
  const [categoryFilterValue, setCategoryFilterValue] = useState(CATEGORIES["All Categories"]);

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
    <Box sx={{ display: "flex", maxWidth: 1 / 2 }}>
      <Select
        value={categoryFilterValue}
        size="small"
        onChange={(event: SelectChangeEvent) => {
          setCategoryFilterValue(event.target.value);
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
        {Object.entries(CATEGORIES).map(([key, value]) => (
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
        options={dataOptions}
        noOptionsText={<FacetsSuggestion />}
        size="small"
        loading={loading}
        limitTags={2}
        onChange={(event: any, newValue: any) => {
          setFacetFilterIds(newValue.map(v => v.id));
        }}
        filterOptions={x => x}
        getOptionLabel={option => option?.label}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        renderInput={params => (
          <TextField {...params} label={`Search ${entityToGet} specific filter`} fullWidth />
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
          const { category, highlights } = option;
          if (
            option.category === categoryFilterValue ||
            categoryFilterValue === CATEGORIES["All Categories"]
          )
            return (
              <li {...props}>
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
