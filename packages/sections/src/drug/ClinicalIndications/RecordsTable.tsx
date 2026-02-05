import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { OtTable, useApolloClient } from "ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Typography } from "@mui/material";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { defaultRowsPerPageOptions, clinicalStageCategories } from "@ot/constants";
import RECORD_DETAIL_QUERY from "./ClinicalRecordsQuery.gql";
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
    id: "source",
    label: "Source",
    renderCell: (row: any) => (
      <Typography
        sx={{
          maxWidth: "120px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontSize: "14px",
        }}
        title={row.source || "N/A"}
      >
        {row.source || "N/A"}
      </Typography>
    ),
    width: "15%",
  },
  {
    id: "type",
    label: "Type",
    renderCell: (row: any) => (
      <Typography
        sx={{
          maxWidth: "120px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontSize: "14px",
        }}
        title={row.type || "N/A"}
      >
        {row.type || "N/A"}
      </Typography>
    ),
    width: "20%",
  },
  {
    id: "phase",
    label: "Phase",
    renderCell: (row: any) => (
      <Typography
        sx={{
          maxWidth: "120px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontSize: "14px",
        }}
        title={row.phase || "N/A"}
      >
        {row.phase || "N/A"}
      </Typography>
    ),
    width: "15%",
  },
  {
    id: "trialStartDate",
    label: "Start date",
    renderCell: (row: any) => (
      <Typography
        sx={{
          maxWidth: "120px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontSize: "14px",
        }}
        title={row.trialStartDate || "N/A"}
      >
        {row.trialStartDate || "N/A"}
      </Typography>
    ),
    width: "20%",
  },
  {
    id: "trialOverallStatus",
    label: "Status",
    renderCell: (row: any) => (
      <Typography
        sx={{
          maxWidth: "120px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontSize: "14px",
        }}
        title={row.trialOverallStatus || "N/A"}
      >
        {row.trialOverallStatus || "N/A"}
      </Typography>
    ),
    width: "30%",
  },
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

function RecordsTable({
  selectedDisease,
  records,
  // query,
  // variables,
  // loading,
}) {

  const client = useApolloClient();
  const [selectedStage, setSelectedStage] = useState({});

  useEffect(() => {
    if (records && Object.keys(records).length > 0) {
      setSelectedStage(getMaxStage(records));
    }
  }, [records]);

  return (
    <>
      <Box sx={{ ml: 1 }}>
        <StageFilter
          records={records}
          setSelectedStage={setSelectedStage}
          selectedStage={selectedStage}
        />
      </Box>
      <Box sx={{position: "relative", top: "-12px"}}>
        <OtTable
          // showGlobalFilter
          columns={columns}
          rows={records[selectedStage.stage]}
          // dataDownloader
          dataDownloaderFileStem="clinical-records"
          // fixed
          noWrapHeader={false}
          rowsPerPageOptions={defaultRowsPerPageOptions}
          showColumnVisibilityControl={false}
          showGlobalFilter={false}
          // loading={loading}
          hover
        />
      </Box>
    </>
  );
}

export default RecordsTable;