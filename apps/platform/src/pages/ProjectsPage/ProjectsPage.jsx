import React, { Fragment } from 'react';
import { Paper, Box, Typography } from '@material-ui/core';
import projectsData from './projects-data.json';
import { DataTable } from '../../components/Table';
import Link from '../../components/Link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faXmark,
  faCircleCheck,
} from '@fortawesome/free-solid-svg-icons';

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
    label: 'Integrates into PPP',
    renderCell: ({ integrates_in_PPP }) => {
      const icon = integrates_in_PPP === 'Y' ? faCheck : faXmark;
      return <FontAwesomeIcon size="lg" icon={icon} />;
    },
  },
  { id: 'project_status', label: 'Project Status' },
  { id: 'open_targets_therapeutic_area', label: 'Therapeutic Area' },
];

function ProjectPage() {
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
        <Link to="https://platform-docs.opentargets.org/partner-preview-platform" external newTab>
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
