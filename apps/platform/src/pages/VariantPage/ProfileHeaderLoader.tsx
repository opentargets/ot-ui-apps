import { Box, Skeleton } from "@mui/material";
import { ReactElement } from "react";

function ProfileHeaderLoader(): ReactElement {
  return (
    <Box sx={{ display: "flex", flexDirection: "row", gap: 5, padding: 2 }}>
      <Skeleton sx={{ flex: 1, height: 230 }} animation="wave" variant="rectangular" />
      <Skeleton sx={{ flex: 1, height: 230 }} animation="wave" variant="rectangular" />
    </Box>
  );
}
export default ProfileHeaderLoader;
