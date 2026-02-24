import { useState, useEffect, useMemo } from "react";
import { Link, OtTable, useApolloClient } from "ui";
import { Box, Typography } from "@mui/material";
import { defaultRowsPerPageOptions, clinicalStageCategories } from "@ot/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import CLINICAL_RECORDS_QUERY from "./ClinicalRecordsQuery.gql";

const getRecords = (client, query, clinicalReportsIds) =>   // WILL NEED TO PUT ACTUAL PARAMETERS HERE !!
  client.query({
    query,
    variables: {
      clinicalReportsIds,
    },
  });

const onLinkClick = (e) => {
  e.stopPropagation();
};

function stageAndRecordCountComparator(a, b) {
  if (a.maxClinicalStage === b.maxClinicalStage) {
    return a.clinicalReports?.length - b.clinicalReports?.length;
  }
  return clinicalStageCategories[a.maxClinicalStage]?.index -
    clinicalStageCategories[b.maxClinicalStage]?.index;
}

function IndicationsTable({
  rows,
  setRecords,
  setMaxClinicalStage,
  loading,
}) {
  const client = useApolloClient();
  const [selectedRow, setSelectedRow] = useState({});

  // always use copied, sorted rows from this point - avoids issues with selecting initial row
  const sortedRows = useMemo(() => {
    return structuredClone(rows).sort(stageAndRecordCountComparator).reverse();
  }, [rows]);

  const displayRows = useMemo(() => {
    return sortedRows.map((row: any) => ({
      ...row,
      _isSelected: selectedRow != null && row.id === selectedRow.id,
    }));
  }, [sortedRows, selectedRow]);

  // load records when change row - and on initial load
  useEffect(() => {
    if (!selectedRow.clinicalReports) return;
    const fetchRecords = async () => {
      const recordsData = (await getRecords(
        client,
        CLINICAL_RECORDS_QUERY,
        selectedRow.clinicalReports.map(report => report.id)
      )).data.clinicalReports;  // !! ASSUME SUCCESS FOR NOW BUT SHOULD HANDLE ERROR !!
      const groupedRecordsData = Object.groupBy(recordsData, row => row.clinicalStage);
      setRecords(groupedRecordsData);
    };
    fetchRecords();
  }, [selectedRow]);

  const columns = [
    {
      id: "indicationCard",
      label: "",
      renderCell: (row) => {
        const {
          disease,
          maxClinicalStage,
          clinicalReports,
          _isSelected
        } = row
        return (
          <Box 
            sx={{ 
              p: "0.5rem 0.5rem 0.5rem 1rem",
              borderWidth: "0 0 0 4px",
              borderStyle: "solid",
              borderRadius: 1,
              borderColor: _isSelected ? "primary.main" : "background.paper",
              bgcolor: _isSelected ? '#e1eff9' : 'background.paper',  // !! ARBITRARY COLOR !!
              cursor: 'pointer',
              '&:hover': {
                bgcolor: _isSelected ? '#e1eff9' : 'grey.100',  // !! ARBITRARY COLOR !!
                borderColor: _isSelected ? "primary.main" : "grey.300",
                "& .arrow-icon": {
                  visibility: "visible",
                },
              }
            }}
          >
            {/* Top: Indication link as title */}
            <Typography
              variant="h6"
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                // fontWeight: 'bold',
                mb: 0,
                color: 'primary.main'
              }}
            >
              <Link asyncTooltip to={`/disease/${disease.id}`} onClick={onLinkClick}>
                {disease.name}
              </Link>
            </Typography>

            {/* Bottom section with max phase and record count */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {/* Bottom left: Max clinical stage */}
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
                <Typography variant="caption">
                  Max stage:
                </Typography>
                <Typography variant="caption" sx={{ fontSize: 13 }}>
                  {clinicalStageCategories[maxClinicalStage].label}
                </Typography>
              </Box>

              {/* Bottom right: Number of records */}
              <Box sx={{ display: "flex", gap: 0.6, alignItems: "baseline" }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: 12,
                    color: 'text.secondary'
                  }}
                >
                  {clinicalReports?.length ?? "XX"} records
                </Typography>
                <Box
                  className="arrow-icon"
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
        );
      },
      sortable: true,
      comparator: stageAndRecordCountComparator,
      filterValue: row => {
        return `${row.disease.name} ${clinicalStageCategories[row.maxClinicalStage]?.label}`
      }
    },
  ];

  return (
    <Box
      sx={{
        px: 1,  
        py: 0,  
        position: 'relative',
        "&::after": {  // vertical line full height of section
          content: '""',
          position: 'absolute',
          right: 0,
          top: -16,  
          bottom: -24,  
          width: '1px',
          backgroundColor: 'divider',  
          opacity: 0.8,  
        },
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
          maxWidth: 0,  
          borderBottom: "none !important",
          ":hover": {bgcolor: "transparent"}
        },
        "& > div > :nth-of-type(2)": theme => ({
          paddingTop: "0.5rem",
          marginLeft: "-1.5rem",  // to reach left edge
          marginRight: "-0.5rem",  // to not overshoot right border
          width: `calc(100% + ${theme.spacing(4)})`,
        }),
      }}
    >
      <OtTable
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
            selectedOriginalRows.find(r => r.id !== selectedRow.id) ??
            selectedOriginalRows[0];

          if (!nextRow?.id) return;

          if (nextRow.id !== selectedRow.id) {  // avoids render loop from calling setRecords unnecessarily
            setSelectedRow(nextRow);
            setMaxClinicalStage(nextRow.maxClinicalStage);
          }
        }}
        loading={loading}
        sortBy="indicationCard"
        order="desc"
        showRowsPerPageControl={false}
      />
    </Box>
  );
}

export default IndicationsTable;