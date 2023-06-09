import {
  Button,
  Grid,
  Typography,
  colors,
  makeStyles,
} from "@material-ui/core";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";
import { Link } from "../Components/Link";

const useStyles = makeStyles((theme) => ({
  hiddenMobile: {
    "@media (max-width: 767px)": {
      display: "none",
    },
  },
  messageContainer: {
    display: "flex",
    justifyContent: "center",
    height: "80vh",
    alignItems: "center",
  },
  messageLogoContainer: {},
  divider: {
    borderRight: `1px solid ${theme.palette.grey[500]}`,
    height: "65%",
    margin: "0 4em",
  },
  messageBodyHeader: {
    color: theme.palette.primary.main,
    fontWeight: "700",
  },
  messageBottom: {
    display: "flex",
    justifyContent: "center",
  },
  marginTop: {
    marginTop: "2em",
  },
  mainIcon: {
    fontSize: "10em",
    color: theme.palette.primary.dark,
  },
  messageBodyContainer: {
    padding: "4em 0"
  },
}));

type EmptyPageProps = {
  children: ReactNode;
  documentationLink?: string;
};
function EmptyPage({
  children,
  documentationLink = "https://platform-docs.opentargets.org",
}: EmptyPageProps) {
  const classes = useStyles();

  return (
    <div className={classes.messageContainer}>
      <div
        className={`${classes.messageLogoContainer} ${classes.hiddenMobile}`}
      >
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          size="4x"
          className={classes.mainIcon}
        />
      </div>
      <div className={`${classes.divider} ${classes.hiddenMobile}`}></div>
      <div className="message-body-container">
        <Typography variant="h2" className={classes.messageBodyHeader}>
          404: Page not found
        </Typography>
        <div className={classes.messageBodyContainer}>
          <div>{children}</div>
          <Typography>
            You deserve a fresh start. Maybe our
            <Link to={documentationLink}> Documentation</Link> or{" "}
            <Link to={"https://community.opentargets.org/"}>
              Community page
            </Link>{" "}
            can help!
          </Typography>
          <Typography
            className={`${classes.messageBottom} ${classes.marginTop}`}
          >
            or
          </Typography>
        </div>
        <div className={`${classes.messageBottom} `}>
          <Button variant="contained" color="primary">
            Go back to Home Page
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EmptyPage;
