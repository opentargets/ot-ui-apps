import { useState, useEffect } from "react";
import { Link, PaginationActionsComplete, OtTable, useApolloClient } from "ui";
import { Typography } from "@mui/material";
import { defaultRowsPerPageOptions, clinicalStageCategories } from "@ot/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import clinicalRecordsData from "./clinical_record_CHEMBL2105708.json";
import CLINICAL_RECORDS_QUERY from "./ClinicalRecordsQuery.gql";
import StageFilter from "./StageFilter";

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

function stageAndRecordCountComparator(a, b) {
  if (a.maxClinicalStatus === b.maxClinicalStatus) {
    return a.clinicalReportIds?.length - b.clinicalReportIds?.length;
  }
  return clinicalStageCategories[a.maxClinicalStatus]?.index -
    clinicalStageCategories[b.maxClinicalStatus]?.index;
}

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
  },
  {
    id: "maxClinicalStage",
    label: "Max stage",
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
        {clinicalStageCategories[maxClinicalStatus].label}
      </Typography>
    ),
    sortable: true,
    comparator: stageAndRecordCountComparator,
  },
  {
    id: "reports",
    label: "Reports",
    renderCell: ({ clinicalReportIds }: any) => (
      <>
        {clinicalReportIds.length}
        <span className="selected-evidence">
          <FontAwesomeIcon icon={faPlay} />
        </span>
      </>
    ),
    numeric: true,
    exportValue: (row: any) => row.clinicalReportIds.length,
    sortable: true,
    comparator: (a, b) => {
      return a.clinicalReportIds?.length - b.clinicalReportIds?.length;
    }
  },
];

function selectRecords({ setRecords, row }) {
  // !! ONCE HAVE API, USE getRecords AND CLINICAL_RECORDS_QUERY HERE TO FETCH FROM API
  const recordsData = row.clinicalReportIds
    .map((reportId: any) => {
      const record = clinicalRecordsData.find((r: any) => r.id === reportId);
      return record ? { ...record } : null;
    })
    .filter((r: any) => r !== null);
  const groupedRecordsData = Object.groupBy(recordsData, row => row.clinicalStatus);
  setRecords(groupedRecordsData);
}

function IndicationsTable({
  rows,
  setRecords,
  query,
  variables,
  loading,
}) {

  const client = useApolloClient();

  // always use sorted rows from this point - avoids issues with selecting initial row
  const sortedRows = rows.toSorted(stageAndRecordCountComparator).reverse();

  return (
    <>
      <OtTable
        showGlobalFilter
        columns={columns}
        rows={sortedRows}
        dataDownloader
        dataDownloaderFileStem="clinical-indications"
        showColumnVisibilityControl={false}
        getSelectedRows={rowsInfo => {
          if (!(rowsInfo?.length > 0)) return;
          selectRecords({ setRecords, row: sortedRows[rowsInfo[0].index] })
        }}
        onPagination={a => console.log(a)}
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
        sortBy="maxClinicalStage"
        order="desc"
      />
    </>
  );
}

export default IndicationsTable