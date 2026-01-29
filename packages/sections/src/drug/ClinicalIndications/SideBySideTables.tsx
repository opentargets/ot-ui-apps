import { useState, useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import { Link, DataTable } from "ui";
import { defaultRowsPerPageOptions } from "@ot/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

import clinicalRecordsData from "./clinical_record_CHEMBL2105708.json";

const onLinkClick = (e: any) => {
  e.stopPropagation();
};

const indicationsColumns = [
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

const recordsColumns = [
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

function SideBySideTables({
  rows,
  query,
  variables,
  loading
}: any) {
  const [records, setRecords] = useState<any[]>([]);
  const [selectedDisease, setSelectedDisease] = useState("");

  useEffect(() => {
    if (rows && rows.length > 0) {
      const firstRow = rows[0];
      setSelectedDisease(firstRow.diseaseName);
      const recordsData = firstRow.clinicalReportIds
        .map((reportId: any) => {
          const record = clinicalRecordsData.find((r: any) => r.id === reportId);
          return record ? { ...record } : null;
        })
        .filter((r: any) => r !== null);
      setRecords(recordsData);
    }
  }, [rows]);

  const handleRowClick = (row: any) => {
    setSelectedDisease(row.diseaseName);
    const recordsData = row.clinicalReportIds
      .map((reportId: any) => {
        const record = clinicalRecordsData.find((r: any) => r.id === reportId);
        return record ? { ...record } : null;
      })
      .filter((r: any) => r !== null);
    setRecords(recordsData);
  };

  return (
    <>
      <Grid container spacing={10}>
        <Grid item xs={12} md={5}>
          <Typography variant="body1" gutterBottom>
            Clinical Indications
          </Typography>
          <DataTable
            showGlobalFilter
            columns={indicationsColumns}
            rows={rows}
            dataDownloader
            dataDownloaderFileStem="clinical-indications"
            hover
            selected
            onRowClick={handleRowClick}
            rowIsSelectable
            fixed
            noWrapHeader={false}
            onPagination={(page: number, pageSize: number) => {
              const selectedRow = rows[page * pageSize];
              if (selectedRow) {
                setSelectedDisease(selectedRow.diseaseName);
                const recordsData = selectedRow.clinicalReportIds
                  .map((reportId: any) => {
                    const record = clinicalRecordsData.find((r: any) => r.id === reportId);
                    return record ? { ...record } : null;
                  })
                  .filter((r: any) => r !== null);
                setRecords(recordsData);
              }
            }}
            rowsPerPageOptions={defaultRowsPerPageOptions}
            loading={loading}
            query={query}
            variables={variables}
          />
        </Grid>

        <Grid item xs={12} md={7}>
          <Typography variant="body1" gutterBottom>
            Records for {selectedDisease}
          </Typography>
          <DataTable
            showGlobalFilter
            columns={recordsColumns}
            rows={records}
            dataDownloader
            dataDownloaderFileStem="clinical-records"
            fixed
            noWrapHeader={false}
            rowsPerPageOptions={defaultRowsPerPageOptions}
            loading={loading}
            hover
          />
        </Grid>
      </Grid>
    </>
  );
}

export default SideBySideTables;