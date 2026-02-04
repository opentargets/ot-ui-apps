import { useState, useEffect } from "react";
import { Link, PaginationActionsComplete, OtTable, useApolloClient } from "ui";
import { Typography } from "@mui/material";
import { defaultRowsPerPageOptions } from "@ot/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import clinicalRecordsData from "./clinical_record_CHEMBL2105708.json";
import CLINICAL_RECORDS_QUERY from "./ClinicalRecordsQuery.gql";

const getRecords = (client, query, chemblId) =>   // WILL NEED TO PUT ACTUAL PARAMETERS HERE !!
  client.query({
    query,
    variables: {
      chemblId,  // ... AND USE THE PARAMETERS HERE
    },
});

const onLinkClick = (e: any) => {
  e.stopPropagation();
};

const columns = [
  {
    id: "diseaseId",
    label: "Indication",
    renderCell: ({ diseaseName, diseaseId }: any) => (
      <Typography
        sx={{
          maxWidth: "120px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontSize: "14px",
        }}
        title={diseaseName}
      >
        <Link asyncTooltip to={`/disease/${diseaseId}`} onClick={onLinkClick}>
          {diseaseName}
        </Link>
      </Typography>
    ),
    width: "35%",
  },
  {
    id: "maxClinicalStatus",
    label: "Max status",
    renderCell: ({ maxClinicalStatus }: any) => (
      <Typography
        sx={{
          maxWidth: "120px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontSize: "14px",
        }}
        title={maxClinicalStatus}
      >
        {maxClinicalStatus}
      </Typography>
    ),
    width: "25%",
  },
  {
    id: "mappingConfidence",
    label: "Mapping",
    renderCell: ({ mappingConfidence }: any) => (
      <Typography
        sx={{
          maxWidth: "120px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontSize: "14px",
        }}
        title={mappingConfidence}
      >
        {mappingConfidence}
      </Typography>
    ),
    width: "20%",
  },
  {
    id: "records",
    label: "Records",
    renderCell: ({ clinicalReportIds }: any) => (
      <>
        {clinicalReportIds.length}
        <span className="selected-evidence">
          <FontAwesomeIcon icon={faPlay} />
        </span>
      </>
    ),
    exportValue: (row: any) => row.clinicalReportIds.length,
    width: "20%",
  },
];

function selectRecords({ setSelectedDisease, setRecords, row }) {
  // !! ONCE HAVE API, USE getRecords AND CLINICAL_RECORDS_QUERY HERE TO FETCH FROM API
  setSelectedDisease(row.diseaseName);
  const recordsData = row.clinicalReportIds
  .map((reportId: any) => {
    const record = clinicalRecordsData.find((r: any) => r.id === reportId);
    return record ? { ...record } : null;
  })
  .filter((r: any) => r !== null);
  setRecords(recordsData);
}

function IndicationsTable({
  rows,
  setSelectedDisease,
  setRecords,
  query,
  variables,
  loading,
}) {

  const client = useApolloClient();

  useEffect(() => {
    if (rows?.length > 0) {
      selectRecords({ setSelectedDisease, setRecords, row: rows[0] });
    }
  }, [rows, setSelectedDisease, setRecords]);

  return (
    <>
      {/* <Typography variant="body1" gutterBottom>
        Clinical Indications
      </Typography> */}
      <OtTable
        showGlobalFilter
        columns={columns}
        rows={rows}
        dataDownloader
        dataDownloaderFileStem="clinical-indications"
        // getSelectedRows={a => console.log(a)}
        getSelectedRows={rowsInfo => {
          if (!(rowsInfo?.length > 0)) return;
          selectRecords({ setSelectedDisease, setRecords, row: rows[rowsInfo[0].index] })
        }}
        onPagination={a => console.log(a)}
        // hover
        // selected
        // onRowClick={row => selectRecords({ setSelectedDisease, setRecords, row })}
        // rowIsSelectable
        // fixed
        // noWrapHeader={false}
        // onPagination={(page: number, pageSize: number) => {
        //   const selectedRow = rows[page * pageSize];
        //   if (selectedRow) {
        //     setSelectedDisease(selectedRow.diseaseName);
        //     const recordsData = selectedRow.clinicalReportIds
        //       .map((reportId: any) => {
        //         const record = clinicalRecordsData.find((r: any) => r.id === reportId);
        //         return record ? { ...record } : null;
        //       })
        //       .filter((r: any) => r !== null);
        //     setRecords(recordsData);
        //   }
        // }}
        rowsPerPageOptions={[5, 10, 25]}
        // rowsPerPageOptions={defaultRowsPerPageOptions}
        loading={loading}
        query={query}
        variables={variables}
      />
    </>
  );
}

export default IndicationsTable