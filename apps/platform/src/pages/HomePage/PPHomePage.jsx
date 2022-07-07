import React from 'react';
import {
  Grid,
  makeStyles,
  Typography,
  Hidden,
  Box,
  useMediaQuery,
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
import { Footer } from 'ui';

import {
  appTitle,
  appDescription,
  appCanonicalUrl,
  externalLinks,
  mainMenuItems,
} from '../../constants';
import HomeBox from './HomeBox';
import Link from '../../components/Link';
import NavBar from '../../components/NavBar';
import Search from '../../components/Search';
import searchExamples from './ppSearchExamples';
import Splash from './Splash';
import Version from './Version';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircle,
  faChevronDown,
  faDownload,
  faLaptopCode,
  faQuestionCircle,
  faFileAlt,
  faCommentDots,
} from '@fortawesome/free-solid-svg-icons';

import config from '../../config';

const useStyles = makeStyles(theme => ({
  links: {
    marginTop: '12px',
  },
  api: {
    marginTop: '38px',
  },
  helpBoxes: {
    maxWidth: '120px',
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      textAlign: 'left',
    },
  },
  hpSection: {
    marginBottom: '40px',
  },
  dataPolicy: {
    padding: '10px',
    marginTop: '30px',
    border: '2px solid',
    borderColor: config.profile.primaryColor,
  },
}));

function pickTwo(arr) {
  let i1 = Math.floor(Math.random() * arr.length);
  let i2 = Math.floor(Math.random() * arr.length);

  while (i1 === i2) {
    i2 = Math.floor(Math.random() * arr.length);
  }

  return [arr[i1], arr[i2]];
}

const HomePage = () => {
  const classes = useStyles();
  const targets = pickTwo(searchExamples.targets);
  const diseases = pickTwo(searchExamples.diseases);
  const drugs = pickTwo(searchExamples.drugs);
  const theme = useTheme();
  const xsMQ = useMediaQuery(theme.breakpoints.down('xs'));

  const handleScrollDown = () => {
    window.scrollTo({ top: window.innerHeight, left: 0, behavior: 'smooth' });
  };

  const HelpBoxPanel = ({ fai, url, label, external }) => {
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
    } else {
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
  };

  return (
    <>
      <Helmet title={appTitle}>
        <meta name="description" content={appDescription} />
        <link rel="canonical" href={appCanonicalUrl} />
      </Helmet>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        className={classes.hpSection}
      >
        <Splash />
        <NavBar
          name="platform"
          homepage
          items={mainMenuItems}
          placement="bottom-end"
        />
        <HomeBox>
          <Search autoFocus />
          {/* Search examples */}
          <Grid
            className={classes.links}
            container
            justifyContent="space-around"
          >
            <Link to={`/target/${targets[0].id}/associations`}>
              {targets[0].label}
            </Link>
            <Hidden smDown>
              <Link to={`/target/${targets[1].id}/associations`}>
                {targets[1].label}
              </Link>
            </Hidden>

            <Link to={`/disease/${diseases[0].id}/associations`}>
              {diseases[0].label}
            </Link>
            <Hidden smDown>
              <Link to={`/disease/${diseases[1].id}/associations`}>
                {diseases[1].label}
              </Link>
            </Hidden>

            <Link to={`/drug/${drugs[0].id}`}>{drugs[0].label}</Link>
            <Hidden smDown>
              <Link to={`/drug/${drugs[1].id}`}>{drugs[1].label}</Link>
            </Hidden>
          </Grid>
          <Version />
          <div className={classes.dataPolicy}>
            <Typography
              variant="body2"
              display="block"
              align="center"
              gutterBottom
            >
              The Open Targets Partner Preview Platform is provided exclusively
              to Open Targets consortium members. All data and results of
              queries must remain confidential and must not be shared publicly.
              Please note that data from OTAR projects is pre-publication, being
              actively worked on by projects teams and therefore subject to
              change through further analysis — our release notes contain
              details of any known issues with data sets.{' '}
              <strong>
                The Open Targets Partner Preview Platform is provided
                exclusively for use by Open Targets partner organisations, any
                other usage or access is prohibited.
              </strong>
            </Typography>
            <Typography
              variant="body2"
              display="block"
              align="center"
              gutterBottom
            >
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
        </HomeBox>

        {/* scroll down button */}
        <Grid container justifyContent="center">
          <div
            className="fa-layers fa-fw fa-3x"
            style={{
              height: '0px',
              marginTop: '-1em',
              filter: 'drop-shadow( 1px 1px 2px rgba(0, 0, 0, .5))',
              cursor: 'pointer',
            }}
            onClick={handleScrollDown}
          >
            <FontAwesomeIcon icon={faCircle} inverse />
            <FontAwesomeIcon icon={faChevronDown} transform="shrink-4" />
          </div>
        </Grid>
      </Grid>

      {/* About */}
      <Grid container justifyContent="center" className={classes.hpSection}>
        <Grid item xs={10} md={8}>
          <Typography variant="h4" component="h1" align="center" paragraph>
            About the Open Targets Platform
          </Typography>

          <Typography paragraph>
            The Open Targets Partner Preview Platform is an extension of the
            Open Targets Platform, a comprehensive tool that supports systematic
            identification and prioritisation of potential therapeutic drug
            targets.
          </Typography>

          <Typography paragraph>
            Combining publicly available datasets with pre-publication data
            generated by the consortium, the Partner Preview Platform builds and
            scores target-disease associations to assist in drug target
            identification and prioritisation. It also integrates relevant
            annotation information about targets, diseases, phenotypes, and
            drugs, as well as their most relevant relationships.
          </Typography>

          <Typography paragraph>
            The Partner Preview version of the Open Targets Platform is only
            available to members of the Open Targets consortium. It is actively
            maintained with regular data updates. Data is available through an
            intuitive user interface, and a partner-specific API which includes
            the pre-publication data. The public data is available through data
            downloads, while pre-publication data can be requested through the
            intranet (home.opentargets.org). The pipeline and infrastructure
            codebases are open-source and the licence allows the creation of
            self-hosted private instances of the Platform with custom data.
          </Typography>
        </Grid>
      </Grid>

      {/* Get started */}
      <Grid container justifyContent="center" className={classes.hpSection}>
        <Grid item xs={10} md={8}>
          <Typography variant="h4" component="h1" align="center" paragraph>
            Get started with the Platform
          </Typography>

          <Grid
            container
            justifyContent="space-evenly"
            alignItems="flex-start"
            spacing={1}
          >
            <Grid item xs={12} sm={'auto'}>
              <HelpBoxPanel
                fai={faDownload}
                url="/downloads"
                label="Download all of our open datasets"
              />
            </Grid>

            <Grid item xs={12} sm={'auto'}>
              <HelpBoxPanel
                fai={faLaptopCode}
                url="/api"
                label="Access our partner-specific GraphQL API"
                external
              />
            </Grid>

            <Grid item xs={12} sm={'auto'}>
              <HelpBoxPanel
                fai={faQuestionCircle}
                url="https://platform-docs.opentargets.org/"
                label="Check out our Platform documentation"
                external
              />
            </Grid>

            <Grid item xs={12} sm={'auto'}>
              <HelpBoxPanel
                fai={faFileAlt}
                url="https://platform-docs.opentargets.org/citation"
                label="Read our latest Platform publications"
                external
              />
            </Grid>

            <Grid item xs={12} sm={'auto'}>
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
};

export default HomePage;
