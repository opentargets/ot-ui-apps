
import { Box, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { useViewerState } from "ui";

function NoPathogenicityScores() {
  const viewerState = useViewerState();

  if (viewerState.colorBy !== "pathogenicity" ||
      viewerState.pathogenicityScores) {
    return null;
  }
  
  return (
    <Box
      display="flex"
      flexDirection="column"
      p="0.6rem 0.8rem"
      bgcolor="#f8f8f8c8"
      sx={{ borderBottomRightRadius: "0.2rem" }}
      fontSize={14}
    >
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <FontAwesomeIcon icon={faTriangleExclamation} />
        <Typography variant="body2">Pathogenicity scores not available</Typography>
      </Box>
    </Box>
  );
}

export default NoPathogenicityScores;