import { Typography } from "@mui/material";
import { ReactNode } from "react";

type SectionErrorProps = {
  message: string;
};

function SectionError({ message }: SectionErrorProps): ReactNode {
  return (
    <Typography color="error" align="center">
      {message}
    </Typography>
  );
}

export default SectionError;
