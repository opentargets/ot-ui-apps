import {useState } from "react";

import { Typography } from "@material-ui/core";
import { History, Clear } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core";
import useListOption from "../hooks/useListOption";
// import { openSelectOption } from "../utils/searchUtil";

const useStyles = makeStyles((theme) => ({
  recentItemContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    padding: "0.8rem",
    margin: "0 1rem",
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
  px2: {
    padding: "0 1rem",
  },
}));

function SearchRecentItem() {
  const classes = useStyles();
  const [recentItems, setRecentValue] = useState(JSON.parse(localStorage.getItem("search-history"))) ;
  const [openListItem] = useListOption();

  const clearItem = (e, index) => {
    e.stopPropagation();
    const removedItems = recentItems;
    removedItems.splice(index, 1);
    setRecentValue([...removedItems]);
    localStorage.setItem("search-history", JSON.stringify(recentItems));
  };

  const handleSelectOption = (e) => {
    openListItem(e);
  };

  return (
    <>
      {recentItems && recentItems.length > 0 && (
        <Typography variant="subtitle1" className={classes.px2}>
          <strong>Recent</strong>
        </Typography>
      )}
      {recentItems &&
        recentItems.length > 0 &&
        recentItems.map(
          (item, index) =>
            index < 5 && (
              <div className={classes.recentItemContainer} key={index} onClick={() => {handleSelectOption(item)}}>
                <div className={classes.recentIcon}>
                  <History />
                  <Typography variant="subtitle2">
                    {item.symbol || item.name || item.id}
                  </Typography>
                </div>

                <Clear onClick={(event) => clearItem(event, index)} />
              </div>
            )
        )}
    </>
  );
}

export default SearchRecentItem;
