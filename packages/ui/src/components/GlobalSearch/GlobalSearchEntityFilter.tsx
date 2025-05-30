import { Box, Checkbox, Chip, Divider, FormControlLabel, FormGroup } from "@mui/material";
import { useContext } from "react";
import { defaultEntityFilterState, SearchContext } from "./SearchContext";
import { getSelectedEntityFilterLength } from "./utils/searchUtils";
import GlobalSearchIcon from "./GlobalSearchIcon";

const ALL = "All";

function GlobalSearchEntityFilter() {
  const { filterState, setFilterState } = useContext(SearchContext);

  function handleChangeFilter(key: string, event: React.ChangeEvent<HTMLInputElement>) {
    const newValue = event.target.checked;
    setFilterState({ ...filterState, [key]: newValue });
  }

  function onAllFilterClick() {
    setFilterState({ ...defaultEntityFilterState });
  }

  function getAllFilter() {
    if (getSelectedEntityFilterLength(filterState) === 0) return true;
    return false;
  }

  return (
    <Box>
      <FormGroup>
        <Box sx={{ display: "flex", pr: 2, py: 1 }}>
          <FormControlLabel
            label={""}
            sx={{ mr: 0 }}
            control={
              <>
                <Checkbox
                  checked={getAllFilter()}
                  onChange={onAllFilterClick}
                  inputProps={{ "aria-label": "controlled" }}
                  size="small"
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
                      label={<Box sx={{ textTransform: "capitalize" }}> {ALL}</Box>}
                      variant="outlined"
                      clickable
                      tabIndex={-1}
                      icon={<GlobalSearchIcon entity={ALL} />}
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
                      label={<Box sx={{ textTransform: "capitalize" }}> {ALL}</Box>}
                      variant="outlined"
                      clickable
                      tabIndex={-1}
                      icon={<GlobalSearchIcon entity={ALL} />}
                    />
                  }
                />
              </>
            }
          />
          <Box
            tabIndex="-1"
            sx={{
              width: "1px",
              borderLeft: theme => `1px solid ${theme.palette.grey[400]}`,
              marginY: "10px",
              paddingX: "6px",
            }}
          />
          {/* <Divider orientation="vertical" variant="middle" flexItem sx={{ mr: 1 }} /> */}
          {/* <Box component="hr" sx={{ m: 1 }} /> */}
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
                label={""}
              />
            );
          })}
        </Box>
      </FormGroup>
    </Box>
  );
}
export default GlobalSearchEntityFilter;
