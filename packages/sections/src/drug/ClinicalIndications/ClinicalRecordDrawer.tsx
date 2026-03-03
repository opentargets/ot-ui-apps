import { useState, useEffect, Fragment } from "react";
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
import { clinicalStageCategories } from "@ot/constants";
import {
  Link,
  PublicationsList,
  OtLongText,
  Tooltip,
  useApolloClient,
  useDelayedFlag
} from "ui";
import RECORD_DETAIL_QUERY from "./RecordDetailQuery.gql";
import { sentenceCase } from "@ot/utils";

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

function FieldLabel({ minWidth = 65, children }) {
  return (
    <Typography variant="caption" sx={{ fontWeight: 400, minWidth, mr: 0.5 }}>
      {children}
    </Typography>
  );
}

function FieldRow({ label, labelMinWidth = 70, children }: { label, children }) {
  if (!children) return null;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "baseline",
        my: 1,
      }}>
      <FieldLabel minWidth={labelMinWidth}>{label}</FieldLabel>
      <Box sx={{ flex: 1 }}>{children}</Box>
    </Box>
  );
}

function dedupOnId(rows, propertyName) {
 return [
    ...new Map(
      (rows || [])
        .filter(d => d[propertyName]?.id)
        .map(d => [d[propertyName].id, d])
    ).values(),
  ];
}

function formatType(s) {
  return sentenceCase(s.replace(/_+/g, " "));
}

const tooltipStyle = {
  tooltipIcon: {
    verticalAlign: "baseline",
    top: -8,
    lineHeight: 1,
    fontSize: "0.75em",
    position: "relative",
  },
};

const tooltipSlotProps = {
  popper: {
    modifiers: [
      {
        name: "offset",
        options: { offset: [0, -4] }, // smaller gap (try 2–6)
      },
    ],
  },
};

// fetches and displays record details except for literature
function RecordDetails({ recordId }) {
  const client = useApolloClient();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const showLoading = useDelayedFlag(loading, 250);

  // load details when recordId changes
  useEffect(() => {
    if (!recordId) return;
    const fetchDetails = async () => {
      setLoading(true);
      setDetails(null);
      const res = await getDetails(client, RECORD_DETAIL_QUERY, recordId);
      setDetails(res.data.clinicalReport);
      setLoading(false);
    };
    fetchDetails();
  }, [client, recordId]);

  if (showLoading) {
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
    title,
    type,
    trialStudyType,
    trialPrimaryPurpose,
    source,
    countries,
    clinicalStage,
    trialPhase,
    phaseFromSource,
    trialOverallStatus,
    trialWhyStopped,
    trialStopReasonCategories,
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
      <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
        {title || `[${sentenceCase(type)}]`}
      </Typography>

      {/* Source */}
      <Box sx={{ position: "relative" }}>
        <FieldRow label="Source">
          <Typography variant="body2">{source}</Typography>
        </FieldRow>
        {hasExpertReview && (
          <Chip
            sx={{ position: "absolute", right: 0, top: 0, opacity: 0.8 }}
            label="Expert review"
            variant="outlined"
            size="small"
          />
        )}
      </Box>

      {/* Countries */}
      {countries?.length > 0 && (
        <FieldRow label="Status">
          <Typography variant="body2">
            {countries.join(", ")}
          </Typography>
        </FieldRow>
      )}
      
      {/* Type */}
      {(type || trialStudyType) && (
        <FieldRow label="Type">
          <Typography variant="body2">
            {type && formatType(type)}
            {type && trialStudyType && " - "}
            {trialStudyType && formatType(trialStudyType)}
          </Typography>
        </FieldRow>
      )}
      
      {/* Purpose */}
      {trialPrimaryPurpose && (
        <FieldRow label="Purpose">
          <Typography variant="body2">
            {formatType(trialPrimaryPurpose)}
          </Typography>
        </FieldRow>
      )}

      {/* Start */}
      {trialStartDate && (
        <FieldRow label="Start">
          <Typography variant="body2">{trialStartDate}</Typography>
        </FieldRow>
      )}

      {/* Stage/phase */}
      <FieldRow label="Stage">
        {(trialPhase || phaseFromSource) ? (
          <Tooltip
            showHelpIcon
            style={tooltipStyle}
            slotProps={tooltipSlotProps}
            title={
              <>
                {phaseFromSource && (
                  <FieldRow label="Phase from source:" labelMinWidth={0}>
                    <Typography variant="caption">{phaseFromSource}</Typography>
                  </FieldRow>
                )}
                {trialPhase && (
                  <FieldRow label="Trial phase:" labelMinWidth={0}>
                    <Typography variant="caption">{trialPhase}</Typography>
                  </FieldRow>
                )}
              </>
            }
          >
            <Typography component="span" variant="body2">
              {clinicalStageCategories[clinicalStage].label}
            </Typography>
          </Tooltip>
        ) : (
          <Typography variant="body2">
            {clinicalStageCategories[clinicalStage].label}
          </Typography>
        )}
      </FieldRow>

      {/* Status and why stopped */}
      {trialOverallStatus && (
        <FieldRow label="Status">
          {(trialWhyStopped || trialStopReasonCategories.length > 0) ? (
            <Tooltip
              showHelpIcon
              style={tooltipStyle}
              slotProps={tooltipSlotProps}
              title={
                <>
                  {trialWhyStopped && (
                    <FieldRow label="Why Stopped:" labelMinWidth={0}>
                      <Typography variant="caption" sx={{ whiteSpace: "pre-wrap", tabSize: 4}}>
                        {trialWhyStopped}
                      </Typography>
                    </FieldRow>
                  )}
                  {trialStopReasonCategories.length > 0 && (
                    <FieldRow
                      label={`${trialStopReasonCategories.length > 1 ? "Reasons" : "Reason"}:`}
                      labelMinWidth={0}
                    >
                      <Typography variant="caption">{trialStopReasonCategories.join(", ")}</Typography>
                    </FieldRow>
                  )}
                </>
              }
            >
              <Typography component="span" variant="body2">
                {formatType(trialOverallStatus)}
              </Typography>
            </Tooltip>
          ) : (
            <Typography variant="body2">
              {formatType(trialOverallStatus)}
            </Typography>
          )}
        </FieldRow>
      )}

      {/* URL */}
      {url && (
        <FieldRow label="URL">
          <Typography variant="body2" sx={{ fontSize: 14 }}>
            <Link external to={url}>
              {url}
            </Link>
          </Typography>
        </FieldRow>
      )}

      {/* Diseases */}
      {dedupedDiseases.length > 0 && (
        <FieldRow label="Diseases">
          <OtLongText variant="body2" lineLimit={3} displayText="... more">
            <Box component="span" sx={{ fontSize: 14 }}>
              {dedupedDiseases.map((d, index) => (
                <span key={index}>
                  {index > 0 ? ", " : ""}
                  {d.disease?.id ? (
                    <Link asyncTooltip to={`/disease/${d.disease.id}`}>{d.disease.name}</Link>
                  ) : (
                    d.diseaseFromSource
                  )}
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
              {dedupedDrugs.map((d, index) => (
                <span key={index}>
                  {index > 0 ? ", " : ""}
                  {d.drug?.id ? (
                    <Link asyncTooltip to={`/drug/${d.drug.id}`}>{d.drug.name}</Link>
                  ) : (
                    d.drugFromSource
                  )}
                </span>
              ))}
            </Box>
          </OtLongText>
        </FieldRow>
      )}

      {/* Description */}
      {trialDescription &&
        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", tabSize: 4, mt: 2.5, mb: 3.5 }}>
          {trialDescription}
        </Typography>
      }
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
            <Typography className={classes.drawerTitleCaption}>Report</Typography>
            <IconButton onClick={closeDrawer}>
              <FontAwesomeIcon icon={faXmark} />
            </IconButton>
          </Box>
        </Paper>

        <Box width={700} maxWidth="100%" className={classes.drawerBody}>
          {open && (
            <Box mt={2} mb={3} mx={3} p={3} pb={6} bgcolor="white">
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
                      showRowsPerPageControl={false}
                      // showPaginationAlways={false}
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