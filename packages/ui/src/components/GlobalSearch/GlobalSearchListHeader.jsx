import { makeStyles } from "@mui/styles";
import { Button, Chip, Typography, styled } from "@mui/material";
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

const useStyles = makeStyles(theme => ({
  sectionHeader: {
    textTransform: "capitalize",
    color: theme.palette.grey[600],
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    justifyContent: "space-between",
  },
  label: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    textTransform: "uppercase",
  },
  labelIcon: {
    color: theme.palette.grey[600],
    fontSize: "0.8rem",
  },
}));

const ClearAllButton = styled(Button)`
  border: none;
`;

function GlobalSearchListHeader({ listHeader, children }) {
  const classes = useStyles();

  const NewChip = (
    <Chip
      style={{
        fontSize: "0.7rem",
        margin: "0",
      }}
      size="small"
      color="primary"
      label="new"
    />
  );

  if (!listHeader) return { children };

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
        return <FontAwesomeIcon icon={faStethoscope} fixedWidth className={classes.labelIcon} />;
      case "targets":
        return <FontAwesomeIcon icon={faDna} fixedWidth className={classes.labelIcon} />;
      case "variants":
        return <FontAwesomeIcon icon={faMapPin} fixedWidth className={classes.labelIcon} />;
      case "studies":
        return <FontAwesomeIcon icon={faChartBar} fixedWidth className={classes.labelIcon} />;
      case "recent":
        return null;
      case "Search Suggestions":
        return null;
      default:
        return <FontAwesomeIcon icon={faTag} />;
    }
  };

  function getIconTag() {
    switch (listHeader) {
      case "variants":
        return NewChip;
      case "studies":
        return NewChip;
      default:
        return null;
    }
  }

  return (
    <div tabIndex="-1" className={classes.sectionHeader}>
      <div className={classes.label}>
        {getIcon()}
        <Typography sx={{ fontWeight: "bold" }} variant="caption">
          {listHeader}
        </Typography>
        <div>{getIconTag()}</div>
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
