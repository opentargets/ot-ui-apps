import React from "react";
import { makeStyles, Typography } from "@material-ui/core";

import { Star, Label } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  sectionHeader: {
    textTransform: "capitalize",
    color: theme.palette.primary.main,
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
}));

function SearchListHeader({ listHeader, children, isTopHit = "false" }) {
  const classes = useStyles();
  return (
    <>
      <div className={classes.sectionHeader}>
        {isTopHit ? <Star /> : <Label />}
        <Typography variant="h6">{listHeader}</Typography>
      </div>
      {children}
    </>
  );
}

export default SearchListHeader;
