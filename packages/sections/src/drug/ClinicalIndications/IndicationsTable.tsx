import { useState, useMemo } from "react";
import { Link, PaginationActionsComplete, OtTable, useApolloClient } from "ui";
import { Box, Typography } from "@mui/material";
import { defaultRowsPerPageOptions, clinicalStageCategories } from "@ot/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

import clinicalRecordsData from "./clinical_report_CHEMBL192.json";
// import clinicalRecordsData from "./clinical_record_CHEMBL2105708.json";
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
  if (a.maxClinicalStage === b.maxClinicalStage) {
    return a.clinicalReportIds?.length - b.clinicalReportIds?.length;
  }
  return clinicalStageCategories[a.maxClinicalStage]?.index -
    clinicalStageCategories[b.maxClinicalStage]?.index;
}

function selectRecords({ setRecords, row }) {
  // !! ONCE HAVE API, USE getRecords AND CLINICAL_RECORDS_QUERY HERE TO FETCH FROM API
  const recordsData = row.clinicalReportIds
    .map((reportId: any) => {
      const record = clinicalRecordsData.find((r: any) => r.id === reportId);
      return record ? { ...record } : null;
    })
    .filter((r: any) => r !== null);
  const groupedRecordsData = Object.groupBy(recordsData, row => row.clinicalStage);
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
  const [selectedRowId, setSelectedRowId] = useState(null);

  // always use copied, sorted rows from this point - avoids issues with selecting initial row

  const sortedRows = useMemo(() => {
    return structuredClone(rows).sort(stageAndRecordCountComparator).reverse();
  }, [rows]);  // Only depend on rows, not selectedRowIndex

  const displayRows = useMemo(() => {
    return sortedRows.map((row: any) => ({
      ...row,
      _isSelected: selectedRowId != null && row.id === selectedRowId,
    }));
  }, [sortedRows, selectedRowId]);

  // defined columns inside component so can see selectedRowIndex
  const columns = [
    {
      id: "diseaseId",
      label: "Indication",
      renderCell: ({ diseaseId }: any) => (
        <Typography
          sx={{
            maxWidth: "120px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: "14px",
          }}
          title={diseaseId}
        >
          <Link asyncTooltip to={`/disease/${diseaseId}`} onClick={onLinkClick}>
            {diseaseId}
          </Link>
        </Typography>
      ),
    },
    {
      id: "maxClinicalStage",
      label: "Max stage",
      renderCell: ({ maxClinicalStage }: any) => (
        <Typography
          sx={{
            maxWidth: "120px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: "14px",
          }}
          title={maxClinicalStage}
        >
          {clinicalStageCategories[maxClinicalStage].label}
        </Typography>
      ),
      sortable: true,
      comparator: stageAndRecordCountComparator,
      filterValue: row => clinicalStageCategories[row.maxClinicalStage]?.label,
    },
    {
      id: "reports",
      label: "Reports",
      renderCell: ({ clinicalReportIds }: any) => clinicalReportIds.length,
      numeric: true,
      exportValue: (row: any) => row.clinicalReportIds.length,
      sortable: true,
      comparator: (a, b) => {
        return a.clinicalReportIds?.length - b.clinicalReportIds?.length;
      }
    },
    {
      id: "arrow",
      label: "",
      renderCell: ({ _isSelected }: any) => (
        _isSelected && (
          <Box
            sx={{
              width: "0px",
              fontSize: "10px",
              position: "relative",
              left: "-20px",
              display: "flex",
              alignItems: "end",
              color: "#999",
            }}
          >
            <FontAwesomeIcon icon={faPlay} />
          </Box>
        )
      ),
      exportValue: false,
      enableColumnFilter: false, 
    },
  ];

  return (
    <>
      <OtTable
        // key={selectedRowIndex}
        showGlobalFilter
        columns={columns}
        rows={displayRows}
        dataDownloader
        dataDownloaderFileStem="clinical-indications"
        showColumnVisibilityControl={false}
        getSelectedRows={rowsInfo => {
          if (!(rowsInfo?.length > 0)) return;

          const selectedOriginalRows = rowsInfo.map(r => r.original).filter(Boolean);
          if (!selectedOriginalRows.length) return;

          const nextRow =
            selectedOriginalRows.find(r => r.id !== selectedRowId) ??
            selectedOriginalRows[0];

          if (!nextRow?.id) return;

          if (nextRow.id !== selectedRowId) {  // avoids render loop from calling setRecords unnecessarily
            setSelectedRowId(nextRow.id);
            selectRecords({ setRecords, row: nextRow });
          }
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