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

const useStyles = makeStyles((theme) => ({
  sectionHeader: {
    textTransform: "capitalize",
    color: theme.palette.primary.main,
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    margin: "0.5rem 1rem 0.5rem 2rem",
    justifyContent: "space-between",
  },
  label: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  labelIcon: {
    color: theme.palette.primary.main,
    fontSize: "1.5rem",
  },
}));

const ClearAllButton = styled(Button)`
  border: none;
`;

function SearchListHeader({
  listHeader,
  children,
  clearAll,
}: {
  listHeader: any;
  children: React.ReactNode;
  clearAll: () => void;
}) {
  const classes = useStyles();

  if (listHeader === "") return <>{children}</>;

  const getIcon = () => {
    switch (listHeader) {
      case "topHit":
        return <FontAwesomeIcon icon={faStar} className={classes.labelIcon} />;
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
        );
      default:
        return <FontAwesomeIcon icon={faTag} />;
    }
  };

  return (
    <>
      <div className={classes.sectionHeader}>
        <div className={classes.label}>
          {getIcon()}
          <Typography variant="h6">{listHeader}</Typography>
        </div>
        {listHeader === "recent" && (
          <ClearAllButton onClick={clearAll}>
            <Typography variant="caption">clear all</Typography>
          </ClearAllButton>
        )}
      </div>
      {children}
    </>
  );
}

export default SearchListHeader;