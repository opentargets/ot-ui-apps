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
    margin: "0.5rem 2rem",
  },
}));

function SearchListHeader({ listHeader, children }) {
  const classes = useStyles();
  const isTopHit = "topHit";
  return (
    <>
      <div className={classes.sectionHeader}>
        {listHeader === isTopHit ? <Star /> : <Label />}
        <Typography variant="h6">{listHeader}</Typography>
      </div>
      {children}
    </>
  );
}

export default SearchListHeader;
