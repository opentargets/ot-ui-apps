import {
  Box,
  Button,
  Chip,
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
  FacetsSelect,
} from "./facetsLayout";
import { getFacetsData } from "./service/facetsService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faCaretUp,
  faChevronDown,
  faFilter,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { ENTITY, Facet } from "./facetsTypes";

const FilterButton = styled(Button)(({ theme }) => ({
  border: "none",
  "& .MuiButton-startIcon": {
    fontSize: "14px !important",
  },
}));

const getEntityLabel = (entityToGet: ENTITY) =>
  ENTITY.DISEASE === entityToGet ? "Disease" : "Target";

function FacetsSearch(): ReactElement {
  const { entityToGet, facetFilterSelect, id } = useAotfContext();
  const [inputValue, setInputValue] = useState("");
  const debouncedInputValue = useDebounce(inputValue, 200);
  const [state, dispatch] = useReducer(facetsReducer, entityToGet, createInitialState);
  const client = useApolloClient();
  const inputSelectedOptions = [];

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

  const open = Boolean(anchorEl);
  const popoverId = open ? "simple-popover" : undefined;

  useEffect(() => {
    if (inputValue) getFacetsQueryData();
    else dispatch(setFacetsData([]));
  }, [debouncedInputValue]);

  useEffect(() => {
    dispatch(resetFacets(entityToGet));
  }, [id]);

  return (
    <Box sx={{ mr: 2 }}>
      <FilterButton
        // startIcon={<FontAwesomeIcon icon={faFilter} />}
        // endIcon={<FontAwesomeIcon icon={faCaretDown} />}
        aria-describedby={popoverId}
        variant="text"
        onClick={handleClick}
        sx={{ height: 1 }}
      >
        Advance filters
        <Box component="span" sx={{ ml: 1 }}>
          {open ? (
            <FontAwesomeIcon icon={faCaretUp} size="lg" />
          ) : (
            <FontAwesomeIcon icon={faCaretDown} size="lg" />
          )}
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
        <Box sx={{ maxWidth: "500px", display: "flex", p: 3, flexDirection: "column", gap: 2 }}>
          <FacetsSuggestion />
          <Box sx={{ display: "flex" }}>
            <FacetsAutocomplete
              id="facets-search-input"
              multiple
              // autoComplete
              freeSolo
              includeInputInList
              filterSelectedOptions
              options={state.dataOptions}
              value={inputSelectedOptions}
              // noOptionsText={<FacetsSuggestion />}
              loading={state.loading}
              size="small"
              limitTags={2}
              onChange={(event, newValue) => {
                dispatch(selectFacet([...state.selectedFacets, ...newValue]));
                facetFilterSelect(newValue);
                setInputValue("");
              }}
              filterOptions={x => x}
              getOptionLabel={option => option?.label}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
              }}
              renderInput={params => (
                <TextField {...params} label={`Search ${entityToGet} filter`} fullWidth />
              )}
              // renderTags={(value, getTagProps) =>
              //   value.map((option: any, index: number) => (
              //     <Tooltip title={option.label} key={option.id} style="">
              //       <Box sx={{ maxWidth: "150px" }} key={option.id}>
              //         <Chip
              //           size="small"
              //           label={option.label}
              //           {...getTagProps({ index })}
              //           key={option.id}
              //         />
              //       </Box>
              //     </Tooltip>
              //   ))
              // }
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
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {state.selectedFacets.map((facet: Facet) => (
              <Tooltip title={facet.label} key={facet.id} style="">
                <Box sx={{ maxWidth: "150px" }} key={facet.id}>
                  <Chip
                    clickable
                    onDelete={() => ({})}
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
