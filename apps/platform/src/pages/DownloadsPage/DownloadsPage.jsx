import { Paper, Box, Chip, Typography, Alert, AlertTitle } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Link, OtTable } from "ui";
import { getConfig } from "@ot/config";
import datasetMappings from "./dataset-mappings.json";
import { v1 } from "uuid";

const config = getConfig();

const useStyles = makeStyles(theme => ({
  alert: {
    marginBottom: theme.spacing(2),
  },
}));

function getColumn(locationUrl) {
  const columns = [
    { id: "name", label: "Name" },
    {
      id: "containedIn",
      label: "Contained In",
      renderCell: ({ containedIn, includes }) => {
        const columnId = includes.split("/")[0];

        return containedIn.map(e => (
          <Chip
            sx={{ mr: 1 }}
            key={v1()}
            component="a"
            label={e["@id"]}
            clickable
            size="small"
            href={`${locationUrl[e["@id"]]}${columnId}`}
          />
        ));
      },
    },
    { id: "encodingFormat", label: "Format" },
    { id: "description", label: "Description" },
  ];
  return columns;
}

function getRows() {
  return datasetMappings.distribution.filter(e => e["@type"] === "cr:FileSet");
}

function getAllLocationUrl() {
  const locationArray = datasetMappings.distribution.filter(e => e["@type"] === "cr:FileObject");
  const locationObj = {};
  locationArray.map(e => {
    locationObj[e["@id"]] = e.contentUrl;
  });
  return locationObj;
}

function DownloadsPage() {
  const rows = getRows();
  const locationUrl = getAllLocationUrl();
  const columns = getColumn(locationUrl);

  const classes = useStyles();

  return (
    <>
      <Typography variant="h4" component="h1" paragraph>
        {datasetMappings.name}
      </Typography>
      <Typography paragraph>{datasetMappings.description}</Typography>
      <Typography paragraph>
        Our scripts and schema conforms to{" "}
        <Link external to={datasetMappings.conformsTo}>
          Ml Commons
        </Link>
      </Typography>
      <Typography paragraph>Current data version: {datasetMappings.version}</Typography>

      {config.isPartnerPreview ? (
        <Alert severity="warning" className={classes.alert}>
          <AlertTitle>Important Note</AlertTitle>
          These data files do not contain any of the custom data found in this version of the
          Platform. They are the same files that are available from the public Platform. To download
          the data for a specific project, please visit the{" "}
          <Link external to="http://home.opentargets.org/">
            Open Targets Intranet
          </Link>{" "}
          and submit a data request.
        </Alert>
      ) : null}

      <Paper variant="outlined" elevation={0}>
        <Box m={2}>
          <OtTable showGlobalFilter rows={rows} columns={columns} loading={!rows.length} />
        </Box>
      </Paper>
    </>
  );
}

export default DownloadsPage;
