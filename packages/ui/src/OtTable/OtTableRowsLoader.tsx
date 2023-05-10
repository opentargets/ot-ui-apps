import { Grid } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

function OtTableRowsLoader() {
  return (
    <Grid container alignItems="flex-start">
      <Skeleton animation="wave" variant="rect" width="100%" height="30rem" />
    </Grid>
  );
}

export default OtTableRowsLoader;
