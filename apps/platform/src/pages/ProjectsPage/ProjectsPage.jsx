import React, { Fragment } from 'react';
import { Paper, Box, Typography } from '@material-ui/core';
// import Link from '../../components/Link';
import projectsData from './projects-data.json';
import { DataTable } from '../../components/Table';

const columns = [
  { id: 'otar_code', label: 'Project Code' },
  { id: 'project_name', label: 'Project Name' },
  { id: 'project_lead', label: 'Project Lead' },
  { id: 'generates_data', label: 'Generates Data' },
  { id: 'integrates_in_PPP', label: 'Integrates into PPP' },
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
        The table below contains key information on the active OTAR projects,
        their status and data availability into the PPP.
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
