import { Box } from "@mui/material";

function OtCodeBlock({ children }) {
  return (
    <Box
      sx={{
        display: "flex",
        borderRadius: 3,
        background: theme => theme.palette.grey[100],
        color: theme => theme.palette.grey[800],
        px: 3,
        py: 1,
      }}
    >
      <code>{children}</code>
    </Box>
  );
}
export default OtCodeBlock;
