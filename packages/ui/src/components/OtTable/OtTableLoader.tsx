import { Grid, Skeleton } from "@mui/material";
import OtTableRowsLoader from "./OtTableRowsLoader";

function OtTableLoader() {
  return (
    <div className="loaderContainer">
      <Grid container>
        <Skeleton animation="wave" width="40%" height="3rem" />
      </Grid>

      <OtTableRowsLoader />
      <Grid container justifyContent="space-between">
        <Skeleton animation="wave" width="10%" height="3rem" />
        <Skeleton animation="wave" width="15%" height="3rem" />
      </Grid>
    </div>
  );
}

export default OtTableLoader;
