import React from "react";
import { makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({

  justifyBetween: {
    display: "flex",
    justifyContent: "space-between",
  },
  symbol: {
    // fontSize: "1.1rem",
    // fontWeight: "700",
    // "&:hover": {
    //   color: theme.palette.primary.main,
    // },
  },
  topHitItem: {
    // fontSize: "1.5rem",
    color: "#3489ca",
  },
  id: {
    padding: "0.3rem 0 0 1rem ",
    // fontSize: "0.7rem",
    fontStyle: "italic",
  },
  pubDate: {
    fontStyle: "italic",
    // fontWeight: "700",
    // fontSize: "0.8rem",
  },
  listItem: {
    padding: "11px",
    cursor: "pointer",
    border: "0.3px solid transparent",
    textTransform: "capitalize",
    "&:hover": {
      border: "0.3px solid" + theme.palette.primary.main,
      borderRadius: "4px",
      background: "#3489ca29",
      // TODO: add blue color to name and symbol on hover of item
      // symbol: {
      //   color: "#fff"
      // }
    },
  },
}));

function SearchListItem({ item, isTopHit = "false" }) {
  const classes = useStyles();
  return (
    <>
        <div className={classes.listItem}>
          <div className={classes.justifyBetween}>
            <span
              className={`${classes.symbol} ${
                isTopHit && classes.topHitItem
              }`}
            >
              <Typography variant="h5">{item.symbol} {item.symbol && item.name && `-`} {item.name}</Typography>
            </span>
            <span className={classes.id}>{item.id}</span>
          </div>
          {/* {isTopHit && (
            <div className="functionDescription">
              <Typography variant="subtitle1">{item.functionDescriptions[0]} </Typography>
            </div>
          )} */}
          {/* <div className="loci">{item.numAssocLoci} associated loci</div> */}
          <Typography variant="body2">{item.nInitial && `N Study: ` + item.nInitial}</Typography>
          <div className={classes.justifyBetween}>
            <span>
            <Typography variant="body2">{item.pubAuthor && `Author: ` + item.pubAuthor}</Typography>
              <span className={classes.pubDate}>
              <Typography variant="body2">{item.pubDate && ` (` + item.pubDate.substring(0, 4) + `)`}</Typography>
              </span>
            </span>
            <Typography variant="body2">{item.pubJournal && `Journal:` + item.pubJournal}</Typography>
          </div>
          <div className="numbers">
          <Typography variant="body2">{item.start} {item.start && item.end && `-`} {item.end}</Typography>
          </div>
          <Typography variant="body2">{item.hasSumstats}</Typography>
        </div>

    </>
  );
}

export default SearchListItem;
