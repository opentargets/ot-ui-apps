import { useState, useMemo } from "react";
import { Link, OtTable, useApolloClient } from "ui";
import { Box, Typography } from "@mui/material";
import { defaultRowsPerPageOptions, clinicalStageCategories } from "@ot/constants";
import clinicalRecordsData from "./clinical_report_CHEMBL192.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faArrowRight } from "@fortawesome/free-solid-svg-icons";
// import clinicalRecordsData from "./clinical_record_CHEMBL2105708.json";
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
  setMaxClinicalStage,
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
      id: "indicationCard",
      label: "",
      renderCell: ({ diseaseId, maxClinicalStage, clinicalReportIds, _isSelected }: any) => (
        <Box 
          sx={{ 
            p: "0.6rem 0.5rem 0.6rem 1rem",
            borderWidth: "0 0 0 4px",
            borderStyle: "solid",
            borderRadius: 1,
            borderColor: _isSelected ? "primary.main" : "background.paper",
            bgcolor: _isSelected ? '#e1eff9' : 'background.paper',  // !! ARBITRARY COLOR !!
            cursor: 'pointer',
            '&:hover': {
              bgcolor: _isSelected ? '#e1eff9' : 'grey.100',  // !! ARBITRARY COLOR !!
              borderColor: _isSelected ? "primary.main" : "grey.300",
            }
          }}
        >
          {/* Top: Indication link as title */}
          <Typography
            variant="h6"
            sx={{
              fontSize: "14px",
              fontWeight: 'bold',
              mb: 0,
              color: 'primary.main'
            }}
          >
            <Link asyncTooltip to={`/disease/${diseaseId}`} onClick={onLinkClick}>
              {diseaseId}
            </Link>
          </Typography>

          {/* Bottom section with max phase and record count */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Bottom left: Max clinical stage */}
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
              <Typography variant="caption">
                Max phase:
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 13 }}>
                {clinicalStageCategories[maxClinicalStage].label}
              </Typography>
            </Box>

            {/* Bottom right: Number of records */}
            <Box sx={{ display: "flex", gap: 0.75, alignItems: "center" }}>
              <Typography
                variant="caption"
                sx={{
                  fontSize: 12,
                  color: 'text.secondary'
                }}
              >
                {clinicalReportIds.length} records
              </Typography>
              <Box
                sx={{
                  fontSize: "11px",
                  color: "grey.600", // !! ARBITRARY COLOR !!
                  visibility: _isSelected ? "visible" : "hidden",
                }}
              >
                <FontAwesomeIcon icon={faArrowRight} />
              </Box>
            </Box>
          </Box>
        </Box>
      ),
      sortable: true,
      comparator: stageAndRecordCountComparator,
      filterValue: row => clinicalStageCategories[row.maxClinicalStage]?.label,
    },
  ];

  return (
    <Box
      sx={{
        p: 2,
        borderRightWidth: "1px",
        borderRightStyle: "solid",
        borderRightColor: "grey.300",
        "& thead": { display: 'none' },
        "& table": {
          borderCollapse: "collapse",
          borderSpacing: 0,
        },
        "& tr": {
          padding: "0.15rem 0 !important",
          borderBottom: "none !important",
          ":hover": { bgcolor: "transparent" },
        },
        "& td": {
          padding: "0 !important",
          maxWidth: 0,  // forces td to respect overflow
          borderBottom: "none !important",
          ":hover": {bgcolor: "transparent"}
        },
        "& > div > :nth-child(2)": theme => ({
          paddingTop: "1rem",  // !! FLAKY !! - TO UNDO PADDING TO MAKE ROWS FULL BLEED !!
          marginLeft: "-1rem",
          marginRight: "-1rem",
          width: `calc(100% + ${theme.spacing(4)})`,
        }),

      }}
    >
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
            setMaxClinicalStage(nextRow.maxClinicalStage);
            selectRecords({ setRecords, row: nextRow });
          }
        }}
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
        loading={loading}
        sortBy="indicationCard"
        order="desc"
        showRowsPerPageControl={false}
      />
    </Box>
  );
}

export default IndicationsTable;