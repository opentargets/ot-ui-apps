import React, { Fragment } from 'react';
import { Paper, Box, Typography, makeStyles } from '@material-ui/core';
import projectsData from './projects-data.json';
import { DataTable } from '../../components/Table';
import Link from '../../components/Link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faMinus } from '@fortawesome/free-solid-svg-icons';
import { faCircleDot, faCircle  } from '@fortawesome/free-regular-svg-icons';

const useStyles = makeStyles(theme => ({
  icon: {
    color: theme.palette.primary.main,
  },
}));

function ProjectPage() {
  const classes = useStyles();
  const columns = [
    {
      id: 'otar_code',
      label: 'Project Code',
      renderCell: ({ otar_code }) => {
        return otar_code ? (
          <Link to={`http://home.opentargets.org/${otar_code}`} external newTab>
            {otar_code}
          </Link>
        ) : null;
      },
    },
    { id: 'project_name', label: 'Project Name' },
    { id: 'project_lead', label: 'Project Lead' },
    { id: 'generates_data', label: 'Generates Data' },
    {
      id: 'integrates_in_PPP',
      label: 'Currently integrates into PPP',
      renderCell: ({ integrates_in_PPP }) => {
        const icon = integrates_in_PPP === 'Y' ? faCircleCheck : faCircle;
        return (
          <FontAwesomeIcon size="lg" icon={icon} className={classes.icon} />
        );
      },
    },
    { id: 'project_status', label: 'Project Status' },
    { id: 'open_targets_therapeutic_area', label: 'Therapeutic Area' },
  ];
  return (
    <Fragment>
      <Typography variant="h4" component="h1" paragraph>
        Open Targets Projects Table
      </Typography>
      <Typography paragraph>
        The table below contains key information on the OTAR projects, their
        status and data availability into the PPP.
      </Typography>
      <Typography paragraph>
        For further information, please see{' '}
        <Link to="http://home.opentargets.org/data-available" external newTab>
          here
        </Link>{' '}
        or contact us at{' '}
        <Link to={`mailto: datarequests@opentargets.org`} external>
          datarequests@opentargets.org
        </Link>
        .
      </Typography>
      <Typography paragraph>
        PPP specific documentation can be found{' '}
        <Link
          to="http://home.opentargets.org/ppp-documentation"
          external
          newTab
        >
          here
        </Link>
      </Typography>

      <Paper variant="outlined" elevation={0}>
        <Box m={2}>
          <DataTable
            showGlobalFilter
            columns={columns}
            rows={projectsData}
            rowsPerPageOptions={[30]}
          />
        </Box>
      </Paper>
    </Fragment>
  );
}

export default ProjectPage;
