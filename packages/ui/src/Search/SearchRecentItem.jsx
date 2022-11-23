import { Typography } from "@material-ui/core";

import { History, Clear } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  recentItemContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    padding: "0.8rem 0.3rem",
    border: "0.3px solid transparent",
    "&:hover": {
      border: "0.3px solid" + theme.palette.primary.main,
      borderRadius: "4px",
      background: "#3489ca29",
    },
  },
  recentIcon: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
}));

function SearchRecentItem() {
  const classes = useStyles();
  const recentItems = JSON.parse(localStorage.getItem("search-history"));

  return (
    <>
      <Typography variant="subtitle1">
        <strong>Recent</strong>
      </Typography>
      {recentItems &&
        recentItems.length > 0 &&
        recentItems.map((item, index) => (
          <div className={classes.recentItemContainer} key={index}>
            <div className={classes.recentIcon}>
              <History />
              <Typography variant="subtitle2">
                {item.symbol || item.id}
              </Typography>
            </div>

            <Clear />
          </div>
        ))}
    </>
  );
}

export default SearchRecentItem;
