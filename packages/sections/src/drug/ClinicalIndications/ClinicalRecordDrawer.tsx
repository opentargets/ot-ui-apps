import { ReactNode, useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Drawer,
  Typography,
  Paper,
  ButtonBase,
  Chip,
  CircularProgress,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { naLabel } from "@ot/constants";
import { Link, PublicationsList, OtLongText, useApolloClient } from "ui";
import RECORD_DETAIL_QUERY from "./RecordDetailQuery.gql";

const useDrawerStyles = makeStyles(theme => ({
  drawerLink: {
    color: `${theme.palette.primary.main} !important`,
  },
  drawerBody: {
    overflowY: "overlay",
  },
  drawerModal: {
    "& .MuiBackdrop-root": {
      opacity: "0 !important",
    },
  },
  drawerPaper: {
    backgroundColor: theme.palette.grey[300],
    maxWidth: "100%",
  },
  drawerTitle: {
    borderBottom: "1px solid #ccc",
    padding: "1rem",
  },
  drawerTitleCaption: {
    color: theme.palette.grey[700],
    fontSize: "1.2rem",
    fontWeight: "bold",
  },
}));

const getDetails = (client, query, clinicalReportId) =>
  client.query({
    query,
    variables: {
      clinicalReportId,
    },
});

function FieldLabel({ children }: { children }) {
  return (
    <Typography variant="caption" sx={{ fontWeight: 400, minWidth: 65, mr: 1 }}>
      {children}
    </Typography>
  );
}

function FieldRow({ label, children }: { label, children }) {
  if (!children) return null;
  return (
    <Box sx={{ display: "flex", alignItems: "baseline", my: 1 }}>
      <FieldLabel>{label}</FieldLabel>
      <Box sx={{ flex: 1 }}>{children}</Box>
    </Box>
  );
}

function dedupOnId(rows, propertyName) {
 return [
    ...new Map(
      (rows || [])
        .filter(d => d[propertyName].id)
        .map(d => [d[propertyName].id, d])
    ).values(),
  ];
}

// fetches and displays record details except for literature
function RecordDetails({ recordId }) {
  const client = useApolloClient();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // load details when recordId changes
  useEffect(() => {
    if (!recordId) return;
    const fetchDetails = async () => {
      setDetails((await getDetails(
        client,
        RECORD_DETAIL_QUERY,
        recordId,
      )).data.clinicalReport);
      setLoading(false);
    };
    fetchDetails();
  }, [recordId]);

  if (loading) {
    return (
      <Box
        my={8}
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <CircularProgress size={60} />
        <Typography mt={6}>
          Loading clinical report details
        </Typography>
      </Box>
    );
  }

  if (!details) return null;

  const {
    trialOfficialTitle,
    source,
    trialOverallStatus,
    trialStartDate,
    url,
    trialDescription,
    diseases,
    drugs,
    hasExpertReview,
  } = details;

  const dedupedDiseases = dedupOnId(diseases, "disease");
  const dedupedDrugs = dedupOnId(drugs, "drug");

  return (
    <>
      {/* Title */}
      {trialOfficialTitle && (
        <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
          {trialOfficialTitle}
        </Typography>
      )}

      {/* Source */}
      <Box sx={{ position: "relative" }}>
        <FieldRow label="Source">
          <Typography variant="body2">{source || naLabel}</Typography>
        </FieldRow>
        <Chip
          sx={{ position: "absolute", right: 0, top: 0, opacity: 0.8 }}
          label={`${hasExpertReview ? "" : "no"} expert review`}
          variant="outlined"
          size="small"
        />
      </Box>

      {/* Status */}
      <FieldRow label="Status">
        <Typography variant="body2">
          {trialOverallStatus?.toLowerCase() || naLabel}
        </Typography>
      </FieldRow>

      {/* Start */}
      <FieldRow label="Start">
        <Typography variant="body2">{trialStartDate || naLabel}</Typography>
      </FieldRow>

      {/* URL */}
      <FieldRow label="URL">
        {url ? (
          <Typography variant="body2" sx={{ fontSize: 14 }}>
            <Link external to={url}>
              {url}
            </Link>
          </Typography>
        ) : (
          <Typography variant="body2">{naLabel}</Typography>
        )}
      </FieldRow>

      {/* Diseases */}
      {dedupedDiseases.length > 0 && (
        <FieldRow label="Diseases">
          <OtLongText variant="body2" lineLimit={3} displayText="... more">
            <Box component="span" sx={{ fontSize: 14 }}>
              {dedupedDiseases.map((d: any, index: number) => (
                <span key={d.disease.id}>
                  {index > 0 ? ", " : ""}
                  <Link to={`/disease/${d.disease.id}`}>
                    {d.diseaseFromSource}
                  </Link>
                </span>
              ))}
            </Box>
          </OtLongText>
        </FieldRow>
      )}

      {/* Drugs */}
      {dedupedDrugs.length > 0 && (
        <FieldRow label="Drugs">
          <OtLongText variant="body2" lineLimit={3} displayText="... more">
            <Box component="span" sx={{ fontSize: 14 }}>
              {dedupedDrugs.map((d: any, index: number) => (
                <span key={d.drug.id}>
                  {index > 0 ? ", " : ""}
                  <Link to={`/drug/${d.drug.id}`}>
                    {d.drugFromSource}
                  </Link>
                </span>
              ))}
            </Box>
          </OtLongText>
        </FieldRow>
      )}

      {/* Description */}
      <Box sx={{ mt: 2.5, mb: 3.5 }}>
        <Typography variant="body2" sx={{ whiteSpace: "normal" }}>
          {trialDescription || naLabel}
        </Typography>
      </Box>
    </>
  );
}

function ClinicalRecordDrawer({ recordId, literatureIds, children }) {
  const [open, setOpen] = useState(false);
  const classes = useDrawerStyles();

  const toggleDrawer = (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }
    setOpen(true);
  };

  const closeDrawer = () => {
    setOpen(false);
  };

  return (
    <>
      <ButtonBase
        disableRipple
        onClick={toggleDrawer}
        className={classes.drawerLink}
        sx={{ maxWidth: "100%", overflow: "hidden", display: "block" }}
      >
        {children}
      </ButtonBase>

      <Drawer
        anchor="right"
        classes={{ modal: classes.drawerModal, paper: classes.drawerPaper }}
        open={open}
        onClose={closeDrawer}
      >
        <Paper classes={{ root: classes.drawerTitle }} elevation={0}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography className={classes.drawerTitleCaption}>Record</Typography>
            <IconButton onClick={closeDrawer}>
              <FontAwesomeIcon icon={faXmark} />
            </IconButton>
          </Box>
        </Paper>

        <Box width={700} maxWidth="100%" className={classes.drawerBody}>
          {open && (
            <Box my={3} mx={3} p={3} pb={6} bgcolor="white">
              {/* All details except literature */}
              <RecordDetails recordId={recordId} />
              
              {/* Literature */}
              {literatureIds && literatureIds.length > 0 && (
                <Box>
                  <Typography variant="subtitle2">Literature</Typography>
                  <Box sx={{ mt: -5 }}>
                    <PublicationsList
                      entriesIds={literatureIds}
                      hideSearch
                      name={undefined}
                      symbol={undefined}
                    />
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
}

export default ClinicalRecordDrawer;