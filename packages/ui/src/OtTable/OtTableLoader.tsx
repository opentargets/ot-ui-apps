import { Grid } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React from "react";

function OtTableLoader() {
  return (
    <div className="loaderContainer">
      <Grid container>
        <Skeleton animation="wave" width="40%" height="3rem" />
      </Grid>
      <Grid container alignItems="flex-start" >
        <Skeleton animation="wave" variant="rect" width="100%" height="30rem" />
      </Grid>
      <Grid container justifyContent="space-between">
        <Skeleton animation="wave" width="10%" height="3rem" />
        <Skeleton animation="wave" width="15%" height="3rem" />
      </Grid>
    </div>
  );
}

export default OtTableLoader;
