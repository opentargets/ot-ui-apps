
import { OtTable, useApolloClient } from "ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Typography } from "@mui/material";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { defaultRowsPerPageOptions } from "@ot/constants";
import RECORD_DETAIL_QUERY from "./ClinicalRecordsQuery.gql";

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

  return (
    <>
      <Typography variant="body1" gutterBottom>
        Records for {selectedDisease}
      </Typography>
      <OtTable
        // showGlobalFilter
        columns={columns}
        rows={records}
        dataDownloader
        dataDownloaderFileStem="clinical-records"
        // fixed
        noWrapHeader={false}
        rowsPerPageOptions={defaultRowsPerPageOptions}
        // loading={loading}
        hover
      />
    </>
  );
}

export default RecordsTable;