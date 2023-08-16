import { Children } from "react";
import { Grid } from "@material-ui/core";

import summaryStyles from "./summaryStyles";

function SummaryContainer({ children }) {
  const classes = summaryStyles();

  return (
    <Grid
      id="summary-section"
      className={classes.summaryContainer}
      container
      spacing={1}
    >
      {children}
    </Grid>
  );
}

export default SummaryContainer;
