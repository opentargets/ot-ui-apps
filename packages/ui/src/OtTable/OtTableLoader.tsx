import { Grid } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import OtTableRowLoader from "./OtTableRowsLoader";

function OtTableLoader() {
  return (
    <div className="loaderContainer">
      <Grid container>
        <Skeleton animation="wave" width="40%" height="3rem" />
      </Grid>

      <OtTableRowLoader />
      <Grid container justifyContent="space-between">
        <Skeleton animation="wave" width="10%" height="3rem" />
        <Skeleton animation="wave" width="15%" height="3rem" />
      </Grid>
    </div>
  );
}

export default OtTableLoader;
