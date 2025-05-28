import { Box } from "@mui/material";

function OtCodeBlock({ children, removePadding = false }) {
  return (
    <Box
      sx={{
        display: "flex",
        borderRadius: 3,
        background: theme => theme.palette.grey[100],
        color: theme => theme.palette.grey[800],
        ...(!removePadding && { px: 3 }),
        ...(!removePadding && { py: 1 }),
        width: "fit-content",
      }}
    >
      <code>{children}</code>
    </Box>
  );
}
export default OtCodeBlock;
