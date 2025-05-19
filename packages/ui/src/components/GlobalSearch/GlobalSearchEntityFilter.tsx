import { Box, Checkbox, Chip, FormControlLabel, FormGroup } from "@mui/material";
import { useContext } from "react";
import { SearchContext } from "./SearchContext";
import GlobalSearchListHeader from "./GlobalSearchListHeader";
import { getSelectedEntityFilterLength } from "./utils/searchUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import GlobalSearchIcon from "./GlobalSearchIcon";

function GlobalSearchEntityFilter() {
  const { filterState, setFilterState } = useContext(SearchContext);

  function handleChangeFilter(key: string, event: React.ChangeEvent<HTMLInputElement>) {
    const newValue = event.target.checked;
    setFilterState({ ...filterState, [key]: newValue });
  }

  function getFilterCount() {
    console.log(getSelectedEntityFilterLength(filterState));
    return getSelectedEntityFilterLength(filterState);
  }

  return (
    <Box>
      <Box sx={{ display: "flex" }}>
        <GlobalSearchListHeader listHeader="filter" />
      </Box>
      <FormGroup>
        <Box sx={{ display: "flex", pr: 2, py: 1 }}>
          {/* <Checkbox
            checked={!(getFilterCount() > 0)}
            inputProps={{ "aria-label": "controlled" }}
            size="small"
            disableRipple
            // sx={{ p: 1 }}
            icon={
              <Chip
                sx={{
                  border: "1px solid  transparent",
                  fontWeight: "bold",
                  display: "flex",
                  padding: "12px 6px",
                  color: theme => theme.palette.grey[500],
                  ".MuiChip-icon": {
                    fontSize: "12px",
                  },
                }}
                size="small"
                label={<Box sx={{ textTransform: "capitalize" }}> All</Box>}
                variant="outlined"
                clickable
                icon={<GlobalSearchIcon entity={"recent"} />}
              />
            }
            checkedIcon={
              <Chip
                sx={{
                  borderRadius: 2,
                  fontWeight: "bold",
                  display: "flex",
                  padding: "12px 6px",
                  backgroundColor: theme => `${theme.palette.primary.light}30`,
                  ".MuiChip-icon": {
                    fontSize: "12px",
                  },
                }}
                color="primary"
                size="small"
                label={<Box sx={{ textTransform: "capitalize" }}> All</Box>}
                variant="outlined"
                clickable
                icon={<GlobalSearchIcon entity={"recent"} />}
              />
            }
          /> */}
          {Object.entries(filterState).map(([key, value]) => {
            return (
              <FormControlLabel
                key={key}
                sx={{ mr: 0 }}
                control={
                  <>
                    {/* <Checkbox
                      checked={value}
                      onChange={e => handleChangeFilter(key, e)}
                      inputProps={{ "aria-label": "controlled" }}
                      size="small"
                      // sx={{ display: "none" }}
                    /> */}
                    {/* /option 2 */}
                    <Checkbox
                      checked={value}
                      onChange={e => handleChangeFilter(key, e)}
                      inputProps={{ "aria-label": "controlled" }}
                      size="small"
                      // sx={{ p: 1 }}
                      icon={
                        <Chip
                          sx={{
                            borderRadius: 2,
                            fontWeight: "bold",
                            display: "flex",
                            padding: "15px 6px",
                            color: theme => theme.palette.grey[500],
                            ".MuiChip-icon": {
                              fontSize: "12px",
                            },
                          }}
                          size="small"
                          label={<Box sx={{ textTransform: "capitalize" }}> {key}</Box>}
                          variant="outlined"
                          onChange={e => handleChangeFilter(key, e)}
                          clickable
                          tabIndex={-1}
                          icon={<GlobalSearchIcon entity={key} />}
                        />
                      }
                      checkedIcon={
                        <Chip
                          sx={{
                            borderRadius: 2,
                            fontWeight: "bold",
                            display: "flex",
                            padding: "15px 6px",
                            backgroundColor: theme => `${theme.palette.primary.light}30`,
                            ".MuiChip-icon": {
                              fontSize: "12px",
                            },
                          }}
                          color="primary"
                          size="small"
                          label={<Box sx={{ textTransform: "capitalize" }}> {key}</Box>}
                          variant="outlined"
                          onChange={e => handleChangeFilter(key, e)}
                          clickable
                          tabIndex={-1}
                          icon={<GlobalSearchIcon entity={key} />}
                        />
                      }
                    />
                    {/* option 3 */}
                    {/* <Checkbox
                      checked={value}
                      onChange={e => handleChangeFilter(key, e)}
                      inputProps={{ "aria-label": "controlled" }}
                      size="small"
                      disableRipple
                      // sx={{ p: 1 }}
                      icon={
                        <Chip
                          sx={{
                            border: "1px solid  transparent",
                            fontWeight: "bold",
                            display: "flex",
                            padding: "12px 6px",
                            color: theme => theme.palette.grey[500],
                            ".MuiChip-icon": {
                              fontSize: "12px",
                            },
                          }}
                          size="small"
                          label={<Box sx={{ textTransform: "capitalize" }}> {key}</Box>}
                          variant="outlined"
                          onChange={e => handleChangeFilter(key, e)}
                          clickable
                          icon={<GlobalSearchIcon entity={key} />}
                        />
                      }
                      checkedIcon={
                        <Chip
                          sx={{
                            borderRadius: 2,
                            fontWeight: "bold",
                            display: "flex",
                            padding: "12px 6px",
                            backgroundColor: theme => `${theme.palette.primary.light}30`,
                            ".MuiChip-icon": {
                              fontSize: "12px",
                            },
                          }}
                          color="primary"
                          size="small"
                          label={<Box sx={{ textTransform: "capitalize" }}> {key}</Box>}
                          variant="outlined"
                          onChange={e => handleChangeFilter(key, e)}
                          clickable
                          icon={<GlobalSearchIcon entity={key} />}
                        />
                      }
                    /> */}
                  </>
                }
                // label={<Box sx={{ textTransform: "capitalize" }}> {key}</Box>}
                // label={<Box sx={{ textTransform: "capitalize" }}> {key}</Box>}
              />
            );
          })}
        </Box>
      </FormGroup>
    </Box>
  );
}
export default GlobalSearchEntityFilter;
