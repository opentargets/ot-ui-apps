import { makeStyles } from "@mui/styles";
import { Button, Typography, styled } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPrescriptionBottleAlt,
  faStethoscope,
  faDna,
  faChartBar,
  faMapPin,
  faStar,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import { clearAllRecent } from "./utils/searchUtils";

const useStyles = makeStyles((theme) => ({
  sectionHeader: {
    textTransform: "capitalize",
    color: theme.palette.primary.main,
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    margin: "0.5rem 0",
    justifyContent: "space-between",
  },
  label: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    textTransform: "uppercase",
  },
  labelIcon: {
    color: theme.palette.primary.main,
    fontSize: "0.8rem",
  },
}));

const ClearAllButton = styled(Button)`
  border: none;
`;

function GlobalSearchListHeader({ listHeader, children }) {
  const classes = useStyles();

  if (listHeader === "") return { children };

  const getIcon = () => {
    switch (listHeader) {
      case "topHit":
        return <FontAwesomeIcon icon={faStar} className={classes.labelIcon} />;
      case "drugs":
        return (
          <FontAwesomeIcon
            icon={faPrescriptionBottleAlt}
            fixedWidth
            className={classes.labelIcon}
          />
        );
      case "diseases":
        return (
          <FontAwesomeIcon
            icon={faStethoscope}
            fixedWidth
            className={classes.labelIcon}
          />
        );
      case "targets":
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
        );
      default:
        return <FontAwesomeIcon icon={faTag} />;
    }
  };

  return (
    <div tabIndex="-1" className={classes.sectionHeader}>
      <div className={classes.label}>
        {getIcon()}
        <Typography variant="caption">{listHeader}</Typography>
      </div>
      {listHeader === "recent" && (
        <ClearAllButton onClick={clearAllRecent}>
          <Typography variant="caption">clear all</Typography>
        </ClearAllButton>
      )}
    </div>
  );
}

export default GlobalSearchListHeader;
