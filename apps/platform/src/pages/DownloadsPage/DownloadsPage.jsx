import { useEffect, useState } from "react";
import { Paper, Box, Chip, Typography, Alert, AlertTitle } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Link, OtTable } from "ui";
import { getConfig } from "@ot/config";
import { v1 } from "uuid";
import { Fragment } from "react/jsx-runtime";
import ContainedInDrawer from "./ContainedInDrawer";

const config = getConfig();

const useStyles = makeStyles(theme => ({
  alert: {
    marginBottom: theme.spacing(2),
  },
}));

const LOCATION_MAPPING = {
  "ftp-location": {
    displayName: "FTP",
    format: "parquet",
  },
  "gcp-location": {
    displayName: "Google Cloud",
    format: "parquet",
  },
};

function getColumn(locationUrl, version) {
  const columns = [
    { id: "name", label: "Name", enableHiding: false },
    {
      id: "containedIn",
      label: "Contained In",
      renderCell: ({ containedIn, includes, name, encodingFormat }) => {
        const columnId = includes.split("/")[0];

        return containedIn.map(e => (
          <Fragment key={v1()}>
            <ContainedInDrawer
              link={`${locationUrl[e["@id"]]}${columnId}`}
              title={name}
              location={e["@id"]}
              version={version}
              path={columnId}
              format={encodingFormat}
            >
              <Chip
                sx={{ mr: 1 }}
                label={LOCATION_MAPPING[e["@id"]].displayName}
                clickable
                size="small"
              />
            </ContainedInDrawer>
          </Fragment>
        ));
      },
    },
    // { id: "encodingFormat", label: "Format" },
    { id: "description", label: "Description" },
  ];
  return columns;
}

function getRows(data) {
  if (!data) return [];
  return data.distribution.filter(e => e["@type"] === "cr:FileSet");
}

function getAllLocationUrl(data) {
  if (!data) return "";
  const locationObj = {};
  const locationArray = data.distribution.filter(e => e["@type"] === "cr:FileObject");
  locationArray.map(e => {
    locationObj[e["@id"]] = e.contentUrl;
  });
  return locationObj;
}

function DownloadsPage() {
  const [loading, setLoading] = useState(true);
  const [downloadsData, setDownloadsData] = useState(null);
  const rows = getRows(downloadsData);
  const locationUrl = getAllLocationUrl(downloadsData);
  const columns = getColumn(locationUrl, downloadsData?.version);

  useEffect(() => {
    let isCurrent = true;
    setLoading(true);
    fetch(config.downloadsURL)
      .then(res => res.json())
      .then(data => {
        if (isCurrent) setDownloadsData(data);
        setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const classes = useStyles();

  return (
    <>
      <Typography variant="h4" component="h1" paragraph>
        {downloadsData?.name}
      </Typography>
      <Typography paragraph>{downloadsData?.description}</Typography>
      <Typography paragraph>
        Our scripts and schema conforms to{" "}
        <Link external to={downloadsData?.conformsTo}>
          Ml Commons
        </Link>
      </Typography>
      <Typography paragraph>Current data version: {downloadsData?.version}</Typography>

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
          <OtTable showGlobalFilter rows={rows} columns={columns} loading={loading} />
        </Box>
      </Paper>
    </>
  );
}

export default DownloadsPage;
