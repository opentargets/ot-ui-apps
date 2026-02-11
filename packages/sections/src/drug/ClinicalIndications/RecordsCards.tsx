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

      const displayTitle = (
        <Typography
          variant={"body1"}
          noWrap
          sx={{ 
            minWidth: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {trialOfficialTitle || `[${sentenceCase(type)}]`}
        </Typography>
      );

      return (
        <Box sx={{ mb: 0.5, overflow: "hidden" }}>
          <Box sx={{ display: "inline-block", maxWidth: "100%", overflow: "hidden", verticalAlign: "top" }}>
            {url ? (
              <Link component="button">{displayTitle}</Link>
            ) : (
              <Box>{displayTitle}</Box>
            )}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {source && (
                <Box sx={{ display: "flex", width: "150px", alignItems: "baseline", gap: 0.5 }}>
                  <Typography variant="caption">
                    Source:
                  </Typography>
                  <Typography variant= "caption" sx={{ fontSize: 13 }}>
                    {source}
                  </Typography>
                </Box>
              )}
              {trialOverallStatus && (
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
                  <Typography variant="caption">
                    Status:
                  </Typography>
                  <Typography variant= "caption" sx={{ fontSize: 13 }}>
                    {trialOverallStatus?.toLowerCase()}
                  </Typography>
                </Box>
              )}
            </Box>
            {trialStartDate && (
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
                <Typography variant="caption">
                  Start:
                </Typography>
                {/* <Typography variant= "caption" sx={{ fontSize: 13 }}> */}
                <Typography
                  variant= "caption"
                  sx={{
                    fontSize: 13,
                    fontVariant: "common-ligatures tabular-nums",
                    letterSpacing: "-0.05em",
                  }}
                >
                  {trialStartDate.slice(0, 4)}
                </Typography>
              </Box>
            )}
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
          mt: 0.25,
          "& thead": { display: 'none' },
          "& tr": {
            padding: "0.15rem 0 !important",
            ":hover": {bgcolor: "transparent"},
          },
          "& td": {
            padding: "0.15rem 0 !important",
            maxWidth: 0,  // forces td to respect overflow
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
          showRowsPerPageControl={false}
        />
      </Box>
    </>
  );
}

export default RecordsCards;