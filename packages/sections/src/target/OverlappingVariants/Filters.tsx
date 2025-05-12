import { useStateValue, useActions } from "./Context";
import { Autocomplete, Box, TextField, Chip } from "@mui/material";

function FreeTextFilter() {
  const { state } = useStateValue();
  const { setSearchText } = useActions();

  // const actions = useActions();
  // console.log(actions);

  // console.log(state);

  function handleChange(event) {
    setSearchText(event.target.value);
  }

  return (
    <TextField
      label="Search diseases"
      variant="outlined"
      value={state.searchText}
      onChange={handleChange}
    />
  );
}

function TherapeuticAreasFilter() {
  const { state } = useStateValue();
  const { setTherapeuticAreas } = useActions();

  function handleChange(event, value) {
    setTherapeuticAreas(value);
    console.log(value);
  }

  return (
    <Autocomplete
      freeSolo
      multiple
      onChange={handleChange}
      options={[
        // !! PUT CORRECT VALUES IN HERE
        "disease",
        "observation",
        "measurement",
        "condition",
      ]}
      sx={{ width: 200 }}
      renderInput={params => <TextField {...params} label="Therapeutic areas" />}
      // renderValue={(value, getItemProps) => <Chip label={value} {...getItemProps()} />}
    />
  );
}

function Filters() {
  return (
    <Box display="flex" gap={2}>
      <FreeTextFilter />
      <TherapeuticAreasFilter />
    </Box>
  );
}
export default Filters;
