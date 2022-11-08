import React from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  h3: {},
  sectionHeader: {
    textTransform: "capitalize",
    color: theme.palette.primary.main,
  },
  justifyBetween: {
    display: "flex",
    justifyContent: "space-between",
  },
  symbol: {
    fontSize: "1.1rem",
    fontWeight: "700",
    // "&:hover": {
    //   color: theme.palette.primary.main,
    // },
  },
  id: {
    padding: "0.3rem 0 0 1rem ",
    fontSize: "0.7rem",
    fontStyle: "italic",
  },
  pubDate: {
    fontStyle: "italic",
    fontWeight: "700",
    fontSize: "0.8rem",
  },
  listItem: {
    padding: "11px",
    cursor: "pointer",
    border: "0.3px solid transparent",
    textTransform: "capitalize",
    "&:hover": {
      border: "0.3px solid" + theme.palette.primary.main,
      borderRadius: "5px",
      background: "#3489ca29",
      symbol: {
        color: "#fff"
      }
    },
  },
}));

function SearchListItem({ allListItems }) {
  const classes = useStyles();
  return (
    <>
      <h3 className={classes.sectionHeader}>{allListItems.type}</h3>
      {allListItems.data.map((item, index) => (
        <div className={classes.listItem} key={index}>
          <div className={classes.justifyBetween}>
            <span className={classes.symbol}>
              {item.symbol} {item.symbol && item.name && `-`} {item.name}
            </span>
            <span className={classes.id}>{item.id}</span>
          </div>
          {/* <div className="loci">{item.numAssocLoci} associated loci</div> */}
          <div className="numbers">
            {item.nInitial && `N Study: ` + item.nInitial}
          </div>
          <div className="author">
            {item.pubAuthor && `Author: ` + item.pubAuthor}
            <span className={classes.pubDate}>
              {item.pubDate && ` (` + item.pubDate.substring(0, 4) + `)`}
            </span>
            {item.pubJournal && `Journal:` + item.pubJournal}
          </div>
          <div className="numbers">
            {item.start} {item.start && item.end && `-`} {item.end}
          </div>
          {item.hasSumstats}
        </div>
      ))}
    </>
  );
}

export default SearchListItem;
