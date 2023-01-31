import React, { Fragment } from 'react';
import { Paper, Box, Typography } from '@material-ui/core';
// import Link from '../../components/Link';
import projectsData from './projects-data.json';
import { DataTable } from '../../components/Table';

const columns = [
  { id: 'otar_code', label: 'OT Code' },
  { id: 'project_name', label: 'Name' },
  { id: 'project_lead', label: 'Lead' },
  { id: 'generates_data', label: 'Generated data' },
  { id: 'integrates_in_PPP', label: 'Integrates in PPP' },
  { id: 'data_available', label: 'Available' },
  { id: 'project_status', label: 'Project status' },
  { id: 'open_targets_therapeutic_area', label: 'OT Therapeutic area' },
];

function ProjectPage() {
  return (
    <Fragment>
      <Typography variant="h4" component="h1" paragraph>
        OT Projects
      </Typography>
      <Typography paragraph>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et
        euismod enim, non aliquam quam. Proin sapien nisl, mollis non nunc eget,
        convallis cursus ligula. Cras rutrum, risus in vehicula lobortis, eros
        sem placerat purus, vel fermentum sem tortor sit amet eros.
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
