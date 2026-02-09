import { useState, useEffect } from "react";
import { OtTable, useApolloClient, Link} from "ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  IconButton,
  Drawer,
  Typography,
  Paper,
  ButtonBase,
  Button,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { faPlay, faXmark, faPlusCircle, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { defaultRowsPerPageOptions, clinicalStageCategories } from "@ot/constants";
import RECORD_DETAIL_QUERY from "./ClinicalRecordsQuery.gql";
import { sentenceCase } from "@ot/utils";
import StageFilter from "./StageFilter";

const getRecordDetail = (client, query, /* variables here */) =>   // WILL NEED TO PUT ACTUAL PARAMETERS HERE !!
  client.query({
    query,
    variables: {
       // ... AND USE THE PARAMETERS HERE
    },
});

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
        <Box sx={{ mb: 0.5 }}>
          <Link external="true" to={url}>
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
              <span style={{ fontWeight: 500}}>{type}</span>
            </Typography>
          </Box>

          <Box sx={{ display: "flex", mt: -0.15, alignItems: "center", justifyContent: "space-between", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
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
                  {trialOverallStatus?.toLowerCase()}
                </Typography>
              </Box>
            </Box>
            <Button
              // className={classes.detailsButton}
              variant="text"
              size="small"
              sx={{ border: "none" }}
              // disabled={!abstract}
              // onClick={handleShowAbstractClick}
              // startIcon={<FontAwesomeIcon icon={faPlusCircle} size="sm" />}
              // sx={{ my: 2 }}
            >
              <Typography variant="caption">Details</Typography>&nbsp;
              <FontAwesomeIcon size="sm" icon={faChevronRight} />
            </Button>
          </Box>
          

        
        </Box>
      );
    },
  }
];

function getMaxStage(records) {
  let maxIndex = -Infinity;
  let maxStage;
  for (const stage of Object.keys(records)) {
    const index = clinicalStageCategories[stage].index;
    if (index > maxIndex) {
      maxIndex = index;
      maxStage = stage;
    }
  }
  // console.log({ index: maxIndex, stage: maxStage })
  return { index: maxIndex, stage: maxStage };
}

function selectRecord({ recordId }) {
  // !! ONCE HAVE API, USE getRecordDetail TO FETCH THE RECORD DETAILS
  console.log("open detail modal!")
}

function RecordsCards({
  records,
  // query,
  // variables,
  // loading,
}) {
  const client = useApolloClient();
  const [selectedStage, setSelectedStage] = useState({});
  const [maxStage, setMaxStage] = useState(null);
  
  useEffect(() => {
    if (records && Object.keys(records).length > 0) {
      const _maxStage = getMaxStage(records);
      setMaxStage(_maxStage);
      setSelectedStage(_maxStage);
    }
  }, [records]);

  // if (!records || Object.keys(records).length === 0) return null;
  if (!selectedStage?.stage) return null;

  return (
    <>
      <StageFilter
        records={records}
        setSelectedStage={setSelectedStage}
        selectedStage={selectedStage}
        maxStage={maxStage}
      />
      <Box
        sx={{
          mr: 4,
          mt: 0.5,
          "& thead": { display: 'none' },
          "& tr": {
            padding: "0 !important",
            ":hover": {bgcolor: "transparent"}
          },
          "& td": {
            padding: "0 !important",
            ":hover": {bgcolor: "transparent"}
          },
        }}
      >
        <OtTable
          // showGlobalFilter
          columns={columns}
          rows={records[selectedStage.stage]}
          // dataDownloader
          // dataDownloaderFileStem="clinical-records"`
          // fixed
          noWrapHeader={false}
          rowsPerPageOptions={defaultRowsPerPageOptions}
          // loading={loading}
          showGlobalFilter={false}
          // hover={false}
          showColumnVisibilityControl={false}
        />
      </Box>
    </>
  );
}

export default RecordsCards;