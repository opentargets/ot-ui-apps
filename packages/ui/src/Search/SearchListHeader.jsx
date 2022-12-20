import React from "react";
import { makeStyles, Typography } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrescriptionBottleAlt, faStethoscope, faDna, faChartBar, faMapPin } from '@fortawesome/free-solid-svg-icons';

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
  labelIcon: {
    color: theme.palette.primary.main,
    fontSize: "1.5rem",
  },
}));

function SearchListHeader({ listHeader, children }) {
  const classes = useStyles();

  const getIcon = () => {
    switch (listHeader) {
      case "topHit":
        return <Star className={classes.labelIcon} />;
      case "drug":
        return (
          <FontAwesomeIcon
            icon={faPrescriptionBottleAlt}
            fixedWidth
            className={classes.labelIcon}
          />
        );
        case "disease":
        return (
          <FontAwesomeIcon
            icon={faStethoscope}
            fixedWidth
            className={classes.labelIcon}
          />
        );
        case "target":
        return (
          <FontAwesomeIcon
            icon={faDna}
            fixedWidth
            className={classes.labelIcon}
          />
        );
        case "Study":
        return (
          <FontAwesomeIcon
            icon={faChartBar}
            fixedWidth
            className={classes.labelIcon}
          />
        );
        case "Gene":
        return (
          <FontAwesomeIcon
            icon={faDna}
            fixedWidth
            className={classes.labelIcon}
          />
        );
        case "Variant":
          return (
            <FontAwesomeIcon
            icon={faMapPin}
            fixedWidth
            className={classes.labelIcon}
          />
          )
      default:
        return <Label />;
    }
  };

  return (
    <>
      <div className={classes.sectionHeader}>
        {getIcon()}
        <Typography variant="h6">{listHeader}</Typography>
      </div>
      {children}
    </>
  );
}

export default SearchListHeader;
