import { Box, Checkbox, Chip, FormControlLabel, FormGroup } from "@mui/material";
import { useContext } from "react";
import { SearchContext } from "./SearchContext";
import GlobalSearchListHeader from "./GlobalSearchListHeader";
import { getSelectedEntityFilterLength } from "./utils/searchUtils";

function GlobalSearchEntityFilter() {
  const { filterState, setFilterState } = useContext(SearchContext);

  function handleChangeFilter(key: string, event: React.ChangeEvent<HTMLInputElement>) {
    const newValue = event.target.checked;
    setFilterState({ ...filterState, [key]: newValue });
  }

  function getFilterCount() {
    return getSelectedEntityFilterLength(filterState);
  }

  return (
    <Box>
      <Box sx={{ display: "flex" }}>
        <GlobalSearchListHeader listHeader="filter" />
        <Box
          sx={theme => ({
            background: theme.palette.primary.dark,
            px: 1,
            py: 0.2,
            borderRadius: 10,
            typography: "caption",
            color: "white",
            visibility: !getFilterCount() ? "hidden" : "visible",
          })}
        >
          {getFilterCount()}
        </Box>
      </Box>
      <FormGroup>
        <Box sx={{ display: "flex", pr: 2, py: 1 }}>
          {Object.entries(filterState).map(([key, value]) => {
            return (
              <FormControlLabel
                key={key}
                control={
                  <>
                    {/* <Checkbox
                      checked={value}
                      onChange={e => handleChangeFilter(key, e)}
                      inputProps={{ "aria-label": "controlled" }}
                      size="small"
                      // sx={{ display: "none" }}
                    /> */}
                    <Checkbox
                      checked={value}
                      onChange={e => handleChangeFilter(key, e)}
                      inputProps={{ "aria-label": "controlled" }}
                      size="small"
                      // sx={{ p: 1 }}
                      icon={
                        <Chip
                          // variant="outlined"
                          color="default"
                          label={<Box sx={{ textTransform: "capitalize" }}> {key}</Box>}
                          clickable
                          onChange={e => handleChangeFilter(key, e)}
                          // size="small"
                          tabIndex={-1}
                        />
                      }
                      checkedIcon={
                        <Chip
                          variant="filled"
                          color="primary"
                          label={<Box sx={{ textTransform: "capitalize" }}> {key}</Box>}
                          clickable
                          onChange={e => handleChangeFilter(key, e)}
                          // size="small"
                          tabIndex={-1}
                        />
                      }
                      // sx={{ display: "none" }}
                    />
                    {/* <Chip
                      variant={value ? "filled" : "outlined"}
                      color={value ? "primary" : "default"}
                      label={<Box sx={{ textTransform: "capitalize" }}> {key}</Box>}
                      clickable
                      onChange={e => handleChangeFilter(key, e)}
                      // onKeyDown={onKeyDown}
                      size="small"
                    /> */}
                  </>
                }
                // label={<Box sx={{ textTransform: "capitalize" }}> {key}</Box>}
                // label={<Box sx={{ textTransform: "capitalize" }}> {key}</Box>}
              />
            );
          })}
          {/* {arr.map(e => (
          <FormControlLabel
            key={e}
            control={
              <Checkbox
                checked={filterState[e]}
                onChange={handleChange}
                inputProps={{ "aria-label": "controlled" }}
              />
            }
            label={e}
          />
        ))} */}
        </Box>
      </FormGroup>
    </Box>
  );
}
export default GlobalSearchEntityFilter;
