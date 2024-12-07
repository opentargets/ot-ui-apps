import { Grid, Typography, Box, useMediaQuery, Chip } from "@mui/material";
import { makeStyles, styled, useTheme } from "@mui/styles";
import { Helmet } from "react-helmet";
import { Footer, GlobalSearch, Link, NavBar, usePermissions } from "ui";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircle,
  faChevronDown,
  faDownload,
  faLaptopCode,
  faQuestionCircle,
  faFileAlt,
  faCommentDots,
  faStethoscope,
  faDna,
  faPrescriptionBottleMedical,
  faMapPin,
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

import config from "../../config";
import { grey } from "@mui/material/colors";

const useStyles = makeStyles(() => ({
  links: {
    marginTop: "12px",
  },
  api: {
    marginTop: "38px",
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

const StyledChip = styled(Chip)(({ theme }) => ({
  border: 1,
  fontSize: "12px",
  fontWeight: "bold",
  boxShadow: 0,
  "&:hover": {
    color: theme.palette.primary.dark,
    background: grey[100],
  },
  "&:hover .MuiChip-icon": {
    color: theme.palette.primary.dark,
  },
}));

function AboutPPP() {
  return (
    <Grid container justifyContent="center" sx={{ my: 10 }}>
      <Grid item xs={10} md={8} sx={{ my: 2 }}>
        <Typography variant="h4" component="h1" align="center" paragraph>
          About the Open Targets Platform
        </Typography>

        <Typography paragraph>
          The Open Targets Partner Preview Platform is an extension of the Open Targets Platform, a
          comprehensive tool that supports systematic identification and prioritisation of potential
          therapeutic drug targets.
        </Typography>

        <Typography paragraph>
          Combining publicly available datasets with pre-publication data generated by the
          consortium, the Partner Preview Platform builds and scores target-disease associations to
          assist in drug target identification and prioritisation. It also integrates relevant
          annotation information about targets, diseases, phenotypes, and drugs, as well as their
          most relevant relationships.
        </Typography>

        <Typography paragraph>
          The Partner Preview version of the Open Targets Platform is only available to members of
          the Open Targets consortium. It is actively maintained with regular data updates. Data is
          available through an intuitive user interface, and a partner-specific API which includes
          the pre-publication data. The public data is available through data downloads, while
          pre-publication data can be requested through the intranet (home.opentargets.org). The
          pipeline and infrastructure codebases are open-source and the licence allows the creation
          of self-hosted private instances of the Platform with custom data.
        </Typography>
      </Grid>
    </Grid>
  );
}

function AboutPublic() {
  return (
    <Grid container justifyContent="center" sx={{ my: 2 }}>
      <Grid item xs={10} md={8} sx={{ my: 2 }}>
        <Typography variant="h4" component="h1" align="center" paragraph>
          About the Open Targets Platform
        </Typography>

        <Typography paragraph>
          The Open Targets Platform is a comprehensive tool that supports systematic identification
          and prioritisation of potential therapeutic drug targets.
        </Typography>

        <Typography paragraph>
          By integrating publicly available datasets including data generated by the Open Targets
          consortium, the Platform builds and scores target-disease associations to assist in drug
          target identification and prioritisation. It also integrates relevant annotation
          information about targets, diseases, phenotypes, and drugs, as well as their most relevant
          relationships.
        </Typography>

        <Typography paragraph>
          The Platform is a freely available resource that is actively maintained with bi-monthly
          data updates. Data is available through an intuitive user interface, an API, and data
          downloads. The pipeline and infrastructure codebases are open-source and the licence
          allows the creation of self-hosted private instances of the Platform with custom data.
        </Typography>
      </Grid>
    </Grid>
  );
}

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
  const { isPartnerPreview } = usePermissions();
  const releaseNotesURL = isPartnerPreview
    ? "http://home.opentargets.org/ppp-release-notes"
    : "https://platform-docs.opentargets.org/release-notes";
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
          {/* Search examples */}
          <Grid
            className={classes.links}
            container
            justifyContent="center"
            gap={1.5}
            sx={{ mt: 4 }}
          >
            <Link to={`/target/${suggestions[0].id}/associations`}>
              <StyledChip
                sx={{ pl: 1, borderRadius: 2 }}
                icon={<FontAwesomeIcon icon={faDna} />}
                label={suggestions[0].name}
              />
            </Link>
            <Link to={`/target/${suggestions[1].id}/associations`}>
              <StyledChip
                sx={{ pl: 1, borderRadius: 2 }}
                icon={<FontAwesomeIcon icon={faDna} />}
                label={suggestions[1].name}
              />
            </Link>
            <Link to={`/disease/${suggestions[2].id}/associations`}>
              <StyledChip
                sx={{ pl: 1, borderRadius: 2 }}
                icon={<FontAwesomeIcon icon={faStethoscope} />}
                label={suggestions[2].name}
              />
            </Link>
            <Link to={`/disease/${suggestions[3].id}/associations`}>
              <StyledChip
                sx={{ pl: 1, borderRadius: 2 }}
                icon={<FontAwesomeIcon icon={faStethoscope} />}
                label={suggestions[3].name}
              />
            </Link>
            <Link to={`/drug/${suggestions[4].id}`}>
              <StyledChip
                sx={{ pl: 1, borderRadius: 2 }}
                icon={<FontAwesomeIcon icon={faPrescriptionBottleMedical} />}
                label={suggestions[4].name}
              />
            </Link>
            <Link to={`/drug/${suggestions[5].id}`}>
              <StyledChip
                sx={{ pl: 1, borderRadius: 2 }}
                icon={<FontAwesomeIcon icon={faPrescriptionBottleMedical} />}
                label={suggestions[5].name}
              />
            </Link>
            <Link to={`/variant/${suggestions[6].id}`}>
              <StyledChip
                sx={{ pl: 1, borderRadius: 2 }}
                icon={<FontAwesomeIcon icon={faMapPin} />}
                label={suggestions[6].name}
              />
            </Link>
            <Link to={`/variant/${suggestions[7].id}`}>
              <StyledChip
                sx={{ pl: 1, borderRadius: 2 }}
                icon={<FontAwesomeIcon icon={faMapPin} />}
                label={suggestions[7].name}
              />
            </Link>
            <Link to={`/variant/${suggestions[8].id}`}>
              <StyledChip
                sx={{ pl: 1, borderRadius: 2 }}
                icon={<FontAwesomeIcon icon={faMapPin} />}
                label={suggestions[8].name}
              />
            </Link>
          </Grid>
          <div>
            <Version releaseNotesURL={releaseNotesURL} />
          </div>
        </HomeBox>

        {/* scroll down button */}
        <Grid container justifyContent="center">
          <div
            className="fa-layers fa-fw fa-3x"
            style={{
              height: "0px",
              marginTop: "-1em",
              filter: "drop-shadow( 1px 1px 2px rgba(0, 0, 0, .5))",
              cursor: "pointer",
            }}
            onClick={handleScrollDown}
          >
            <FontAwesomeIcon icon={faCircle} inverse />
            <FontAwesomeIcon icon={faChevronDown} transform="shrink-4" />
          </div>
        </Grid>
      </Grid>

      {/* About */}
      {isPartnerPreview ? <AboutPPP /> : <AboutPublic />}

      {/* Get started */}
      <Grid container justifyContent="center" sx={{ mb: 10 }}>
        <Grid item xs={10} md={8}>
          <Typography variant="h4" component="h1" align="center" paragraph>
            Get started with the Platform
          </Typography>

          <Grid container justifyContent="space-evenly" alignItems="flex-start" spacing={1}>
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
                label="Access our partner-specific GraphQL API"
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
