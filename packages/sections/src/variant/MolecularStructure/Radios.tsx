import {
  Box,
  Typography,
  FormLabel,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import { useViewerState } from "ui";

function Radios({ titleLabel, options, defaultValue, stateProperty, handleChange }) {

  const viewerState = useViewerState();

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
            <Typography variant="subtitle2">{titleLabel}:</Typography>
          </FormLabel>
          <RadioGroup
            row
            defaultValue={defaultValue}
            value={viewerState[stateProperty]}
            onChange={handleChange}
          >
            {Object.entries(options).map(([label, value], index, array) => (              
                <FormControlLabel
                  key={label}
                  value={value}
                  control={<Radio size="small" />}
                  label={label}
                  slotProps={{
                    typography: { variant: "body2" },
                  }}
                  sx={{
                    mr: label === array.at(-1)[0] ? 0 : 2,
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

export default Radios;