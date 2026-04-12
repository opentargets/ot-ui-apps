import { Box, Typography } from "@mui/material";
import { infoStyle } from "./helpers";

// data should be the chromosome (string)
function XAxisLabel({ data }: { data: string }) { 
  return (
    <Box sx={{ ...infoStyle, alignItems: "end"}}>
      <Typography component="div" variant="caption" sx={{ height: "12px", fontSize: "11px" }}>
        Chr {data}
      </Typography>
    </Box>
  );
}

export default XAxisLabel;