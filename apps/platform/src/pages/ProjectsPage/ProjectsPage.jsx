import { Paper, Box, Typography, Chip } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { OtTable, Link } from "ui";
import projectsData from "./projects-data.json";

const useStyles = makeStyles(theme => ({
  icon: {
    color: theme.palette.primary.main,
  },
  diseaseContainer: {
    display: "flex",
  },
  disease: {
    marginRight: "0.2rem",
  },
}));

const CURRENTLY_INTEGRATES_IN_PPP = {
  Y: faCircleCheck,
  N: faCircleNotch,
};

function ProjectPage() {
  const classes = useStyles();
  const columns = [
    {
      id: "otar_code",
      label: "Project Code",
      renderCell: ({ otar_code: otarCode }) =>
        otarCode ? (
          <Link to={`http://home.opentargets.org/${otarCode}`} external newTab>
            {otarCode}
          </Link>
        ) : null,
    },
    { id: "project_name", label: "Project Name" },
    { id: "project_lead", label: "Project Lead" },
    { id: "generates_data", label: "Generates Data" },
    {
      id: "currently_integrates_in_PPP",
      label: "Currently integrates into PPP",
      renderCell: ({ currently_integrates_in_PPP }) => (
        <FontAwesomeIcon
          size="lg"
          icon={CURRENTLY_INTEGRATES_IN_PPP[currently_integrates_in_PPP]}
          className={classes.icon}
        />
      ),
    },
    { id: "project_status", label: "Project Status" },
    { id: "open_targets_therapeutic_area", label: "Therapeutic Area" },
    {
      id: "disease_mapping",
      label: "Disease Mapped in the PPP",
      renderCell: ({ disease_mapping: diseaseMapping }) => {
        const ALL_AVATARS = [];
        diseaseMapping.forEach(disease => {
          if (disease && disease.disease_id) {
            ALL_AVATARS.push(
              <Link to={`disease/${disease.disease_id}`} key={disease.disease_id}>
                <Chip
                  size="small"
                  label={disease.label || disease.disease_id}
                  clickable
                  color="primary"
                  className={classes.disease}
                />
              </Link>
            );
          }
        });
        return <div className={classes.diseaseContainer}>{ALL_AVATARS}</div>;
      },
    },
  ];
  return (
    <>
      <Typography variant="h4" component="h1" paragraph>
        Open Targets Projects Table
      </Typography>
      <Typography paragraph>
        The table below contains key information on the OTAR projects, their status and data
        availability into the PPP.
      </Typography>
      <Typography paragraph>
        For further information, please see{" "}
        <Link to="http://home.opentargets.org/data-available" external newTab>
          here
        </Link>{" "}
        or contact us at{" "}
        <Link to="mailto: datarequests@opentargets.org" external>
          datarequests@opentargets.org
        </Link>
        .
      </Typography>
      <Typography paragraph>
        PPP specific documentation can be found{" "}
        <Link to="http://home.opentargets.org/ppp-documentation" external newTab>
          here
        </Link>
      </Typography>

      <Paper variant="outlined" elevation={0}>
        <Box m={2}>
          <OtTable
            showGlobalFilter
            columns={columns}
            rows={projectsData}
            rowsPerPageOptions={[30]}
          />
        </Box>
      </Paper>
    </>
  );
}

export default ProjectPage;
