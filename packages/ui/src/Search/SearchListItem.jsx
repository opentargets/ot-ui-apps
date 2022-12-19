import React from "react";
import { makeStyles, Typography, Chip } from "@material-ui/core";
import SearchRecentListItem from "./SearchRecentListItem";

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
    cursor: "pointer",
    textTransform: "capitalize",
    width: "100%",
  },
  author: {
    display: "flex",
  },
}));

function SearchListItem({ item, isTopHit = "false" }) {
  const classes = useStyles();

  if(item.type === "recent") {
    return <SearchRecentListItem item={item} index={0} handleSelectOption={()=>{}} clearItem={()=>{}} />
  }


  return (
    <>
      <div className={classes.listItem}>
        <div className={classes.justifyBetween}>
          <span
            className={`${classes.symbol} ${isTopHit && classes.topHitItem}`}
          >
            <Typography variant="h6">
              {item.symbol} {item.symbol && item.name && `-`} {item.name} 
            </Typography>
          </span>
          <Typography variant="subtitle2"><span className={classes.id}>{item.id}</span></Typography>
        </div>
        {isTopHit && item.functionDescriptions > 0 && (
          <div className="functionDescription">
            <Typography variant="subtitle1">
              {item.functionDescriptions[0].substring(0, 180)} ...{" "}
            </Typography>
          </div>
        )}
        {item.numAssocLoci && (
          <Typography variant="subtitle2">
            <div className="loci">{item.numAssocLoci} associated loci</div>
          </Typography>
        )}
        <div className={classes.justifyBetween}>
          <Typography variant="subtitle2">
            <strong>{item.nInitial && `N Study: ` + item.nInitial } </strong>
          </Typography>

          {item.hasSumstats && (
            <Chip
              style={{
                height: "16px",
                fontSize: "0.8rem",
                margin: "0",
              }}
              color="primary"
              label="summary statistics"
            />
          )}
        </div>

        <div className={classes.justifyBetween}>
          <Typography variant="subtitle2">
            <span className={classes.author}>
              {item.pubAuthor && `Author: ` + item.pubAuthor}
              <span className={classes.pubDate}>
                {item.pubDate && ` (` + item.pubDate.substring(0, 4) + `)`}
              </span>
            </span>
          </Typography>
          <Typography variant="subtitle2">
            {item.pubJournal && `Journal:` + item.pubJournal}
          </Typography>
        </div>
        <div className="numbers">
          <Typography variant="subtitle2">
            {item.start} {item.start && item.end && `-`} {item.end}
          </Typography>
        </div>
      </div>
    </>
  );
}

export default SearchListItem;
