import { Box, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useContext } from "react";
import { SearchContext } from "./SearchContext";

function GlobalSearchEntityFilter() {
  const { filterState, setFilterState } = useContext(SearchContext);

  const handleChangeFilter = (key: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setFilterState({ ...filterState, [key]: newValue });
  };

  return (
    <FormGroup>
      <Box sx={{ display: "flex" }}>
        {/* update the state with */}
        {Object.entries(filterState).map(([key, value]) => {
          return (
            <FormControlLabel
              key={key}
              control={
                <Checkbox
                  checked={value}
                  onChange={e => handleChangeFilter(key, e)}
                  inputProps={{ "aria-label": "controlled" }}
                  size="small"
                />
              }
              label={key}
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
  );
}
export default GlobalSearchEntityFilter;
