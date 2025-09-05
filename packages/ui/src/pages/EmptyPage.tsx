import { makeStyles } from "@mui/styles";
import { Button, Typography } from "@mui/material";

import { ReactNode } from "react";
import Link from "../components/Link";
import BrokenSearchIcon from "../components/icons/BrokenSearchIcon";

const useStyles = makeStyles(theme => ({
  hiddenMobile: {
    "@media (max-width: 767px)": {
      display: "none",
    },
  },
  messageContainer: {
    minHeight: "500px",
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
    fontSize: "13em",
  },
  messageBodyContainer: {
    padding: "4em 0",
  },
}));

type EmptyPageProps = {
  children: ReactNode;
  documentationLink?: string;
  communityLink?: string;
};
function EmptyPage({
  children,
  documentationLink = "https://platform-docs.opentargets.org",
  communityLink = "https://community.opentargets.org",
}: EmptyPageProps) {
  const classes = useStyles();

  return (
    <div className={classes.messageContainer}>
      <div
        className={`${classes.messageLogoContainer} ${classes.hiddenMobile} ${classes.mainIcon}`}
      >
        <BrokenSearchIcon />
      </div>
      <div className={`${classes.divider} ${classes.hiddenMobile}`}></div>
      <div className="message-body-container">
        <Typography variant="h2" className={classes.messageBodyHeader}>
          404: Page not found
        </Typography>
        <div className={classes.messageBodyContainer}>
          <Typography>
            We can't find the page you're looking for. 
            
            You could try: 
            <ul>
            <li>search for a target, disease, drug, variant, or study in the search bar</li>
            <li>check our{" "}
            <Link external to={documentationLink}>
              Documentation
            </Link>{" "}
            to see if we've moved the page you are looking for</li>
            <li>get in touch on the{" "}
            <Link external to={communityLink}>
              Community
            </Link>{" "}
            to report the error</li>
            </ul>
            <br/>
            Thanks!
          </Typography>
        </div>
        <div className={`${classes.messageBottom} `}>
          <Button href="/" variant="contained" color="primary">
            Go back to Home Page
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EmptyPage;
