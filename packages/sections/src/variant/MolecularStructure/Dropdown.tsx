import {
  Box,
  FormControl,
  MenuItem,
  Select,
  OutlinedInput,
  FormLabel,
  Typography
} from "@mui/material";
import { useViewerState } from "ui";

function Dropdown({ options, stateProperty, onChange }) {

  const viewerState = useViewerState();

  return (
    <Box sx={{
      display: "flex",
      gap: 1.5,
      alignItems: "center",
      mb: 1.5,
    }}>
      <FormLabel>
        <Typography variant="subtitle2">Colour</Typography>
      </FormLabel>
      <Box sx={{ width: 240 }}>
        <FormControl fullWidth size="small">
          <Select
            value={viewerState[stateProperty]}
            label="Colour"
            input={<OutlinedInput notched={false} />}
            onChange={onChange}
            >
            {[...Object.entries(options)].map(([label, value]) => (
              <MenuItem key={label} value={value}>{label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}

export default Dropdown;