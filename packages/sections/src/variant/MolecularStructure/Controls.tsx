import {
  Box,
  Typography,
  FormLabel,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import { useViewerState, useViewerDispatch } from "ui";
import { initialState } from "./context";

function Controls() {

  const viewerState = useViewerState();
  const viewerDispatch = useViewerDispatch();

  function handleToggleColor(event) {
    viewerDispatch({
      type: "setColorBy",
      value: event.target.value,
    });
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "end",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <FormControl>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, ml: 1 }}>
          <FormLabel
            sx={{
              "&.Mui-focused": {
                color: "text.primary",
              },
            }}
          >
            <Typography variant="subtitle2">AlphaFold model colour:</Typography>
          </FormLabel>
          <RadioGroup
            row
            defaultValue={initialState.colorBy}
            name="color-by-group"
            value={viewerState.colorBy}
            onChange={handleToggleColor}
          >
            {
              ["confidence", "pathogenicity", "sequential"].map((colorBy, index, array) => (
                <FormControlLabel
                  key={colorBy}
                  value={colorBy}
                  control={<Radio size="small" />}
                  label={colorBy}
                  slotProps={{
                    typography: { variant: "body2" },
                  }}
                  sx={{
                    mr: colorBy === array.at(-1) ? 0 : 2,
                    "& .MuiFormControlLabel-label": {
                      marginLeft: -0.7,
                    },
                  }}
                />
              ))
            }
          </RadioGroup>
        </Box>
      </FormControl>
    </Box>
  );

}

export default Controls;