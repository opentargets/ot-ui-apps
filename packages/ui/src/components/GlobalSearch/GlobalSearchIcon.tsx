import {
  faChartBar,
  faDna,
  faMapPin,
  faPrescriptionBottleAlt,
  faStar,
  faStethoscope,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(theme => ({
  labelIcon: {
    fontSize: "0.8rem",
  },
}));

function GlobalSearchIcon({ entity }: { entity: string }) {
  console.log(" GlobalSearchIcon -> entity", entity);
  const classes = useStyles();

  function getIcon() {
    switch (entity) {
      case "topHit":
        return <FontAwesomeIcon icon={faStar} className={classes.labelIcon} />;
      case "drugs":
      case "drug":
        return (
          <FontAwesomeIcon
            icon={faPrescriptionBottleAlt}
            fixedWidth
            className={classes.labelIcon}
          />
        );
      case "diseases":
      case "disease":
        return <FontAwesomeIcon icon={faStethoscope} fixedWidth className={classes.labelIcon} />;
      case "targets":
      case "target":
        return <FontAwesomeIcon icon={faDna} fixedWidth className={classes.labelIcon} />;
      case "variants":
      case "variant":
        return <FontAwesomeIcon icon={faMapPin} fixedWidth className={classes.labelIcon} />;
      case "studies":
      case "study":
        return <FontAwesomeIcon icon={faChartBar} fixedWidth className={classes.labelIcon} />;
      case "recent":
      case "Search Suggestions":
      case "filter":
        return null;
      default:
        return <FontAwesomeIcon icon={faTag} />;
    }
  }

  return <>{getIcon()}</>;
}
export default GlobalSearchIcon;
