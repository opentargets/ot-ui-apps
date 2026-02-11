import { ReactNode, useState } from "react";
import {
  Box,
  IconButton,
  Drawer,
  Typography,
  Paper,
  ButtonBase,
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
    <Typography variant="caption" sx={{ fontWeight: 600, minWidth: 90, mr: 1 }}>
      {children}
    </Typography>
  );
}

function FieldRow({ label, children }: { label: string; children: ReactNode }) {
  if (!children) return null;
  return (
    <Box sx={{ display: "flex", alignItems: "baseline", mb: 1 }}>
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

  const filteredDiseases = diseases?.filter((d: any) => d.diseaseId) || [];

  return (
    <>
      <ButtonBase disableRipple onClick={toggleDrawer} className={classes.drawerLink}>
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
              <FieldRow label="Source">
                <Typography variant="body2">{source || naLabel}</Typography>
              </FieldRow>

              {/* Status */}
              <FieldRow label="Status">
                <Typography variant="body2">{trialOverallStatus || naLabel}</Typography>
              </FieldRow>

              {/* Start */}
              <FieldRow label="Start">
                <Typography variant="body2">{trialStartDate || naLabel}</Typography>
              </FieldRow>

              {/* URL */}
              <FieldRow label="URL">
                {url ? (
                  <Link external to={url}>
                    {url}
                  </Link>
                ) : (
                  <Typography variant="body2">{naLabel}</Typography>
                )}
              </FieldRow>

              {/* Description */}
              <FieldRow label="Description">
                <Typography variant="body2" sx={{ whiteSpace: "normal" }}>
                  {trialDescription || naLabel}
                </Typography>
              </FieldRow>

              {/* Diseases */}
              {filteredDiseases.length > 0 && (
                <FieldRow label="Diseases">
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {filteredDiseases.map((disease: any, index: number) => (
                      <span key={disease.diseaseId + index}>
                        {index > 0 && ", "}
                        <Link to={`/disease/${disease.diseaseId}`}>
                          {disease.diseaseFromSource || disease.diseaseId}
                        </Link>
                      </span>
                    ))}
                  </Box>
                </FieldRow>
              )}

              {/* Literature */}
              {trialLiterature && trialLiterature.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <FieldLabel>Literature</FieldLabel>
                  <Box sx={{ mt: 1 }}>
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