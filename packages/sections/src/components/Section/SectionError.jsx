import { Typography } from "@mui/material";

function SectionError({ message }) {
  return (
    <Typography color="error" align="center">
      {message}
    </Typography>
  );
}

export default SectionError;
