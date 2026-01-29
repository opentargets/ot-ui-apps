import allRecords from "./clinical_record_CHEMBL2105708.json";  // !! UPDATE ONCE HAVE API !!
import { useState } from "react";
import {
  Box,
  IconButton,
  Drawer,
  Link,
  Typography,
  Paper,
  ButtonBase,
  Button,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { faXmark, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { naLabel } from "@ot/constants";
// import PublicationWrapper from "./PublicationWrapper";
import { OtTable } from "ui";
import { sentenceCase } from "@ot/utils";

const sourceDrawerStyles = makeStyles(theme => ({
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
  AccordionExpanded: {
    margin: "1rem !important",
  },
  AccordionRoot: {
    border: "1px solid #ccc",
    margin: "1rem 1rem 0 1rem",
    padding: "1rem",
    "&::before": {
      backgroundColor: "transparent",
    },
  },
  AccordionSubtitle: {
    color: theme.palette.grey[400],
    fontSize: "0.8rem",
    fontStyle: "italic",
  },
  AccordionTitle: {
    color: theme.palette.grey[700],
    fontSize: "1rem",
    fontWeight: "bold",
  },
  summaryBoxRoot: {
    marginRight: "2rem",
  },
}));

const listComponentStyles = makeStyles(theme => ({
  loader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  AccordionSubtitle: {
    color: theme.palette.grey[400],
    fontSize: "0.8rem",
    fontStyle: "italic",
  },
  ListContent: {
    backgroundColor: "white",
  },
}));

export function RecordsList({ records }) {

  // !! FILTER TO ONLY TRIALS FOR NOW !!
  records = records.filter(record => record.type?.startsWith('clinical trial'));

  const columns = [
    {
      id: "trial",
      label: "",
      renderCell: (record) => {
        const {
          source,
          trialDescription,
          trialStartDate,
          clinicalStatus,
          phase,
          trialLiteratures,
          type,
          trialOverallStatus,
          trialWhyStopped,
          trialStopReasonCategories,
          trialPrimaryPurpose,
          url,
          trialOfficialTitle,
          diseases,
          drugs,
        } = record;
        const diseaseIds = [...new Set(diseases.filter(d => d.diseaseId).map(d => d.diseaseId))];

        return (
          <Box sx={{ mb: 1 }}>
            <Link external="true" to={url} sx={{textDecoration: "none"}}>
              <Box sx={{ display: "flex", width: "100%" }}>
                <Typography
                  variant={"subtitle1"}
                  noWrap
                  sx={{ 
                    minWidth: 0,
                    maxWidth: "100%",
                    width: "200px",  // !! REUIQUIRED FOR ELLIPSES - IS IT DODGY FOR SHORT TITLES? !!
                    flex: 1,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {trialOfficialTitle || `[${sentenceCase(type)}]`}
                </Typography>
              </Box>
            </Link>

            <Box sx={{ display: "flex", mt: 0.15 }}>
              <Typography variant="caption" sx={{ width: "80px"}}>
                <span style={{ fontWeight: 600}}>{sentenceCase(phase?.toLowerCase()) ?? " "}</span> {type}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", mt: 0.15 }}>
              <Box sx={{ display: "flex", width: "150px", alignItems: "baseline", gap: 0.5 }}>
                <Typography variant="caption">
                  Start:
                </Typography>
                <Typography variant= "body2" sx={{width: "100px"}}>
                  {trialStartDate}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
                <Typography variant="caption">
                  Status:
                </Typography>
                <Typography variant= "body2">
                  {trialOverallStatus}
                </Typography>
              </Box>
            </Box>
            
            {diseaseIds.length > 0 && (
              <Box sx={{ display: "flex", mt: 1.5, alignItems: "baseline" }}>
                <Typography variant="caption" sx={{ mr: 0.5 }}>
                  Diseases:
                </Typography>
                {diseaseIds.map((diseaseId, index) => (
                  <Link key={index} to={`../disease/${diseaseId}`} sx={{textDecoration: "none"}}>
                    {index > 0 ? ", " : "" } {diseaseId}
                  </Link>
                ))}
              </Box>
            )}

            <Button
              // className={classes.detailsButton}
              variant="outlined"
              size="small"
              // disabled={!abstract}
              // onClick={handleShowAbstractClick}
              startIcon={<FontAwesomeIcon icon={faPlusCircle} size="sm" />}
              sx={{ my: 2 }}
            >
              Show details
            </Button>
          
          </Box>
        );
      },
    }
  ];

  return (
    <Box sx={{position: "relative", mt: 0}}>
    <OtTable
      columns={columns}
      rows={records}
      showGlobalFilter={true}
      // showGlobalFilter={!hideSearch}
      showColumnVisibilityControl={false}
    />
    </Box>
  );
}

function RecordsDrawer({ recordIds }) {
  const [open, setOpen] = useState(false);
  const classes = sourceDrawerStyles();

  const records = allRecords.filter(record => recordIds.includes(record.id));
  // const trials = records.filter(record => record.type?.startsWith("clinical trial"));
  // const nonTrials = records.filter(record => !record.type?.startsWith("clinical trial"));

  const toggleDrawer = event => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setOpen(true);
  };

  const closeDrawer = () => {
    setOpen(false);
  };

  return (
    <>
      <ButtonBase disableRipple onClick={toggleDrawer} className={classes.drawerLink}>
        <Typography variant="body2">
          {records.length} {records.length > 1 ? "entries" : "entry"}
        </Typography>
      </ButtonBase>

      <Drawer
        anchor="right"
        classes={{ modal: classes.drawerModal, paper: classes.drawerPaper }}
        open={open}
        onClose={closeDrawer}
      >
        <Paper classes={{ root: classes.drawerTitle }} elevation={0}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography className={classes.drawerTitleCaption}>Records</Typography>
            <IconButton onClick={closeDrawer}>
              <FontAwesomeIcon icon={faXmark} />
            </IconButton>
          </Box>
        </Paper>

        <Box width={600} maxWidth="100%" className={classes.drawerBody}>
          {open && (
            <Box my={3} mx={3} p={3} pb={6} bgcolor="white">
              <RecordsList records={records} />
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
}

export default RecordsDrawer;


/*

- current appraoch (like PublicationsDrawer creates one draw per row, prob better to have single drawer that pass appropriate prop to?

 */