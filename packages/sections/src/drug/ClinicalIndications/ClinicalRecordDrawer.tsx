import { ReactNode, useState } from "react";
import {
  Box,
  IconButton,
  Drawer,
  Typography,
  Paper,
  ButtonBase,
  Chip,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { naLabel } from "@ot/constants";
import { Link, PublicationsList } from "ui";

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

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <Typography variant="caption" sx={{ fontWeight: 400, minWidth: 65, mr: 1 }}>
      {children}
    </Typography>
  );
}

function FieldRow({ label, children }: { label: string; children: ReactNode }) {
  if (!children) return null;
  return (
    <Box sx={{ display: "flex", alignItems: "baseline", my: 1 }}>
      <FieldLabel>{label}</FieldLabel>
      <Box sx={{ flex: 1 }}>{children}</Box>
    </Box>
  );
}

function ClinicalRecordDrawer({ record, children }: { record: any; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const classes = useDrawerStyles();

  const {
    trialOfficialTitle,
    source,
    trialOverallStatus,
    trialStartDate,
    url,
    trialDescription,
    diseases,
    trialLiterature,
    hasExpertReview,
  } = record;

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

  const filteredDiseases = [
    ...new Map(
      (diseases || [])
        .filter((d: any) => d.diseaseId)
        .map((d: any) => [d.diseaseId, d])
    ).values(),
  ];

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

        <Box width={600} maxWidth="100%" className={classes.drawerBody}>
          {open && (
            <Box my={3} mx={3} p={3} pb={6} bgcolor="white">
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
              {filteredDiseases.length > 0 && (
                <FieldRow label="Diseases">
                  <Typography variant="body2" sx={{ fontSize: 14 }}>
                    {filteredDiseases.map((disease: any, index: number) => (
                      <span key={disease.diseaseId + index}>
                        {index > 0 ? ", " : ""}
                        <Link to={`/disease/${disease.diseaseId}`}>
                          {disease.diseaseFromSource || disease.diseaseId}
                        </Link>
                      </span>
                    ))}
                  </Typography>
                </FieldRow>
              )}

              {/* Description */}
              <Box sx={{ mt: 2.5, mb: 3.5 }}>
                <Typography variant="body2" sx={{ whiteSpace: "normal" }}>
                  {trialDescription || naLabel}
                </Typography>
              </Box>

              {/* Literature */}
              {trialLiterature && trialLiterature.length > 0 && (
                <Box>
                  <Typography variant="subtitle2">Literature</Typography>
                  <Box sx={{ mt: -5 }}>
                    <PublicationsList
                      entriesIds={trialLiterature}
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