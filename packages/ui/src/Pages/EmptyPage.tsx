import { Button, Grid, Typography, makeStyles } from "@material-ui/core";
import {  faSearchPlus,
} from "@fortawesome/free-solid-svg-icons";
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
    height: "100%",
    alignItems: "center",
  },
  messageLogoContainer: {},
  divider: {
    borderRight: "1px solid ",
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
    marginTop: "1em",
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
        logo
      </div>
      <div className={`${classes.divider} ${classes.hiddenMobile}`}></div>
      <div className="message-body-container">
        <Typography variant="h3" className={classes.messageBodyHeader}>404: Page not found</Typography>
        <div className="message-body-description">
          <div className="message-body-top">{children}</div>
          <Typography>
            You deserve a fresh start. Maybe our
            <Link to={documentationLink}> Documentation</Link> or{" "}
            <Link to={"https://community.opentargets.org/"}>
              Community page
            </Link>{" "}
            can help!
          </Typography>
          <Typography className={`${classes.messageBottom} ${classes.marginTop}`}>or</Typography>
          <div className={`${classes.messageBottom} ${classes.marginTop}`}>
            <Button variant="contained" color="primary">
              Go back to Home Page
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmptyPage;
