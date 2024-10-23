import { Grid, Typography, Hidden, Box, useMediaQuery, IconButton } from "@mui/material";

import { makeStyles, useTheme } from "@mui/styles";
import { Helmet } from "react-helmet";

import { Footer, Link, PrivateWrapper, NavBar, GlobalSearch } from "ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircle,
  faChevronDown,
  faDownload,
  faLaptopCode,
  faQuestionCircle,
  faFileAlt,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";
import {
  appTitle,
  appDescription,
  appCanonicalUrl,
  externalLinks,
  mainMenuItems,
} from "../../constants";
import HomeBox from "./HomeBox";
import Splash from "./Splash";
import Version from "./Version";
import { getSuggestedSearch } from "../../utils/global";

import config from "../../config";

const useStyles = makeStyles(() => ({
  links: {
    marginTop: "12px",
  },
  api: {
    marginTop: "38px",
  },
  hpSection: {
    marginBottom: "40px",
  },
  dataPolicy: {
    padding: "10px",
    marginTop: "30px",
    border: "2px solid",
    borderColor: config.profile.primaryColor,
  },
}));

const usePanelStyles = makeStyles(theme => ({
  helpBoxes: {
    maxWidth: "120px",
    textAlign: "center",
    [theme.breakpoints.down("xs")]: {
      textAlign: "left",
    },
  },
}));

function HelpBoxPanel({ fai, url, label, external }) {
  const theme = useTheme();
  const xsMQ = useMediaQuery(theme.breakpoints.down("xs"));

  const classes = usePanelStyles();

  if (xsMQ) {
    // on xsmall screens
    return (
      <Link to={url} external={external}>
        <Grid container wrap="nowrap" alignItems="center" spacing={1}>
          <Grid item>
            <div className="fa-layers fa-fw fa-3x">
              <FontAwesomeIcon icon={faCircle} />
              <FontAwesomeIcon icon={fai} transform="shrink-8" inverse />
            </div>
          </Grid>
          <Grid item>
            <Typography display="inline">{label}</Typography>
          </Grid>
        </Grid>
      </Link>
    );
  }
  return (
    <Box className={classes.helpBoxes}>
      <Link to={url} external={external}>
        <div className="fa-layers fa-fw fa-6x">
          <FontAwesomeIcon icon={faCircle} />
          <FontAwesomeIcon icon={fai} transform="shrink-8" inverse />
        </div>
        <Typography>{label}</Typography>
      </Link>
    </Box>
  );
}

function HomePage({ suggestions }) {
  const classes = useStyles();

  const handleScrollDown = () => {
    window.scrollTo({ top: window.innerHeight, left: 0, behavior: "smooth" });
  };

  return (
    <>
      <Helmet title={appTitle}>
        <meta name="description" content={appDescription} />
        <link rel="canonical" href={appCanonicalUrl} />
      </Helmet>
      <Grid container justifyContent="center" alignItems="center" className={classes.hpSection}>
        <Splash />
        <NavBar name="platform" homepage items={mainMenuItems} placement="bottom-end" />
        <HomeBox>
          <GlobalSearch isHomePage />

          <Grid className={classes.links} container justifyContent="space-around">
            <Link to={`/target/${suggestions[0].id}/associations`}>
              <Typography variant="body2">{suggestions[0].name}</Typography>
            </Link>
            <Hidden smDown>
              <Link to={`/target/${suggestions[1].id}/associations`}>
                <Typography variant="body2">{suggestions[1].name}</Typography>
              </Link>
            </Hidden>

            <Link to={`/disease/${suggestions[2].id}/associations`}>
              <Typography variant="body2">{suggestions[2].name}</Typography>
            </Link>
            <Hidden smDown>
              <Link to={`/disease/${suggestions[3].id}/associations`}>
                <Typography variant="body2">{suggestions[3].name}</Typography>
              </Link>
            </Hidden>

            <Link to={`/drug/${suggestions[4].id}`}>
              <Typography variant="body2">{suggestions[4].name}</Typography>
            </Link>
            <Hidden smDown>
              <Link to={`/drug/${suggestions[5].id}`}>
                <Typography variant="body2">{suggestions[5].name}</Typography>
              </Link>
            </Hidden>
          </Grid>
          
          <Grid className={classes.links} container justifyContent="space-around">
            <Link to={`/variant/${suggestions[6].id}`}>
              <Typography variant="body2">{suggestions[6].name}</Typography>
            </Link>

            <Hidden smDown>
              <Link to={`/variant/${suggestions[7].id}`}>
                <Typography variant="body2">{suggestions[7].name}</Typography>
              </Link>
            </Hidden>
            
            <Link to={`/variant/${suggestions[8].id}`}>
              <Typography variant="body2">{suggestions[8].name}</Typography>
            </Link>
          </Grid>

          <Version />
          <PrivateWrapper>
            <div className={classes.dataPolicy}>
              <Typography variant="body2" display="block" align="center" gutterBottom>
                The Open Targets Partner Preview Platform is provided exclusively to Open Targets
                consortium members. All data and results of queries must remain confidential and
                must not be shared publicly.
              </Typography>
              <Typography variant="body2" display="block" align="center" gutterBottom>
                <strong>
                  <Link
                    external
                    newTab
                    to="http://home.opentargets.org/partner-preview-platform-data-policy"
                  >
                    View our data policy
                  </Link>
                </strong>
              </Typography>
            </div>
          </PrivateWrapper>
        </HomeBox>

        {/* scroll down button */}
        <Grid container justifyContent="center">
          <IconButton
            id="scrollDownHandler"
            aria-label="Scroll down handler"
            className="fa-layers fa-fw fa-3x"
            style={{
              height: "0px",
              marginTop: "-3em",
              filter: "drop-shadow( 1px 1px 2px rgba(0, 0, 0, .5))",
              cursor: "pointer",
              fontSize: "40px",
            }}
            size="large"
            onClick={handleScrollDown}
          >
            <FontAwesomeIcon icon={faCircle} inverse />
            <FontAwesomeIcon icon={faChevronDown} transform="shrink-4" />
          </IconButton>
        </Grid>
      </Grid>

      {/* About */}
      <Grid container justifyContent="center" sx={{ my: 1 }}>
        <Grid item xs={10} md={8} sx={{ my: 2 }}>
          <Typography variant="h4" component="h1" align="center" paragraph>
            About the Open Targets Platform
          </Typography>

          <Typography paragraph>
            The Open Targets Platform is a comprehensive tool that supports systematic
            identification and prioritisation of potential therapeutic drug targets.
          </Typography>

          <Typography paragraph>
            By integrating publicly available datasets including data generated by the Open Targets
            consortium, the Platform builds and scores target-disease associations to assist in drug
            target identification and prioritisation. It also integrates relevant annotation
            information about targets, diseases, phenotypes, and drugs, as well as their most
            relevant relationships.
          </Typography>

          <Typography paragraph>
            The Platform is a freely available resource that is actively maintained with bi-monthly
            data updates. Data is available through an intuitive user interface, an API, and data
            downloads. The pipeline and infrastructure codebases are open-source and the licence
            allows the creation of self-hosted private instances of the Platform with custom data.
          </Typography>
        </Grid>
      </Grid>

      {/* Get started */}
      <Grid container justifyContent="center" sx={{ mb: 8 }}>
        <Grid item xs={10} md={8} sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" align="center" paragraph>
            Get started with the Platform
          </Typography>

          <Grid
            container
            justifyContent="space-evenly"
            alignItems="flex-start"
            spacing={1}
            sx={{ mt: 3 }}
          >
            <Grid item xs={12} sm="auto">
              <HelpBoxPanel
                fai={faDownload}
                url="/downloads"
                label="Download all of our open datasets"
              />
            </Grid>

            <Grid item xs={12} sm="auto">
              <HelpBoxPanel
                fai={faLaptopCode}
                url="/api"
                label="Access data with our GraphQL API"
                external
              />
            </Grid>

            <Grid item xs={12} sm="auto">
              <HelpBoxPanel
                fai={faQuestionCircle}
                url="https://platform-docs.opentargets.org/"
                label="Check out our Platform documentation"
                external
              />
            </Grid>

            <Grid item xs={12} sm="auto">
              <HelpBoxPanel
                fai={faFileAlt}
                url="https://platform-docs.opentargets.org/citation"
                label="Read our latest Platform publications"
                external
              />
            </Grid>

            <Grid item xs={12} sm="auto">
              <HelpBoxPanel
                fai={faCommentDots}
                url="https://community.opentargets.org/"
                label="Join the Open Targets Community"
                external
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* remove for integration day  */}
      {/* <Stats /> */}
      <Footer externalLinks={externalLinks} />
    </>
  );
}

export default HomePage;
