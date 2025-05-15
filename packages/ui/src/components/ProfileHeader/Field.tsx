import { Skeleton, Typography } from "@mui/material";
import { ReactNode } from "react";

type FieldProps = {
  children?: ReactNode;
  loading: boolean;
  title: string;
};

function Field({ title, loading, children }: FieldProps): ReactNode {
  if (loading) return <Skeleton />;

  if (!children || (Array.isArray(children) && children.length === 0)) {
    return null;
  }

  return (
    <Typography variant="subtitle2">
      {title}:{" "}
      <Typography display="inline" variant="body2">
        {children}
      </Typography>
    </Typography>
  );
}

export default Field;
