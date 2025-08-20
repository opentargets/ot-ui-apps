import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useViewerState } from "ui";

function Dropdown({
  titleLabel,
  options,
  stateProperty,
  onChange,  
}) {

  const viewerState = useViewerState();

  return (
    <Box sx={{ width: 240, mb: 1.5 }}>
      <FormControl fullWidth size="small">
        <InputLabel>{titleLabel}</InputLabel>
        <Select
          value={viewerState[stateProperty]}
          label="Colour"
          onChange={onChange}
        >
          {[...Object.entries(options)].map(([label, value]) => (
            <MenuItem key={label} value={value}>{label}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default Dropdown;