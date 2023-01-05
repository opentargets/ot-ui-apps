import React from "react";
import { makeStyles, Typography, Chip } from "@material-ui/core";
import SearchRecentListItem from "./SearchRecentListItem";
import { commaSeparate } from "../utils/searchUtils";

const useStyles = makeStyles((theme) => ({
  justifyBetween: {
    display: "flex",
    justifyContent: "space-between",
  },
  topHitItem: {
    color: theme.palette.primary.main,
  },
  id: {
    padding: "0.3rem 0 0 1rem ",
    fontStyle: "italic",
    overflowWrap: "break-word",
  },
  listItem: {
    cursor: "pointer",
    width: "100%",
  },
  author: {
    display: "flex",
  },
  symbol: {
    textTransform: "capitalize",
  }
}));

function SearchListItem({ item, isTopHit = "false", clearItem }) {
  const classes = useStyles();

  if (item.type === "recent") {
    return <SearchRecentListItem item={item} clearItem={clearItem} />;
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
              {!item.symbol && !item.name && item.id}
            </Typography>
          </span>
          <Typography variant="subtitle2">
            <span className={classes.id}>{item.id}</span>
          </Typography>
        </div>
        {isTopHit && item.functionDescriptions > 0 && (
          <div className="functionDescription">
            <Typography variant="subtitle1">
              {item.functionDescriptions[0].substring(0, 180)} ...{" "}
            </Typography>
          </div>
        )}

        <div className={classes.justifyBetween}>
          <Typography variant="subtitle2">
            <span className={classes.author}>
              {item.pubAuthor && `Author: ` + item.pubAuthor}
              {item.pubDate && ` (` + item.pubDate.substring(0, 4) + `)`}
            </span>
            <span className={classes.author}>
              {item.position &&
                item.chromosome &&
                `GRCh38:` +
                  item.chromosome +
                  `:` +
                  commaSeparate(item.position)}
            </span>
          </Typography>
          <Typography variant="subtitle2">
            {item.pubJournal && `Journal:` + item.pubJournal}
          </Typography>
        </div>

        {item.rsId && (
          <Typography variant="subtitle2">
            <strong>
              <div className="loci"> Ensembl: {item.rsId}</div>
            </strong>
          </Typography>
        )}

        <div className={classes.justifyBetween}>
          <Typography variant="subtitle2">
            <strong>{item.nInitial && `N Study: ` + item.nInitial} </strong>
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

        {item.numAssocLoci && (
          <Typography variant="subtitle2">
            <div className="loci">{item.numAssocLoci} associated loci</div>
          </Typography>
        )}

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
