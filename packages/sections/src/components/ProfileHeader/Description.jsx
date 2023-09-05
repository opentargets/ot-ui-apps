import { Skeleton, Typography } from "@mui/material";

import { LongText } from "ui";

function Description({ children, loading = false }) {
  const content = children ? (
    <LongText lineLimit={3}>{children}</LongText>
  ) : (
    "No description available"
  );

  return (
    <>
      <Typography variant="subtitle2">Description</Typography>
      {loading ? <Skeleton /> : content}
    </>
  );
}

export default Description;
