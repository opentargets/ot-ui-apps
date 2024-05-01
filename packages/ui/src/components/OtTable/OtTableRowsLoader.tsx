import { Grid, Skeleton } from "@mui/material";

function OtTableRowsLoader() {
  return (
    <Grid container alignItems="flex-start">
      <Skeleton animation="wave" variant="rect" width="100%" height="30rem" />
    </Grid>
  );
}

export default OtTableRowsLoader;
