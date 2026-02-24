import { useState, useEffect } from "react";
import { OtTable } from "ui";
import { Box, Typography } from "@mui/material";
import { defaultRowsPerPageOptions } from "@ot/constants";
import { sentenceCase } from "@ot/utils";
import StageFilter from "./StageFilter";
import ClinicalRecordDrawer from "./ClinicalRecordDrawer";

function RecordsCards({
  records,
  maxClinicalStage,
  // query,
  // variables,
  // loading,
}) {
  const [selectedStage, setSelectedStage] = useState(null);
  useEffect(() => {
    setSelectedStage(maxClinicalStage);
  }, [maxClinicalStage]);

  const columns = [
    {
      id: "trial",
      label: (
        <StageFilter
          records={records}
          setSelectedStage={setSelectedStage}
          selectedStage={selectedStage}
          maxStage={maxClinicalStage}
        />
      ),
      renderCell: (record) => {
        const {
          source,
          trialStartDate,
          type,
          trialOverallStatus,
          trialOfficialTitle,
        } = record;

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
              <ClinicalRecordDrawer recordId={record.id} literatureIds={record.trialLiterature}>
                {displayTitle}
              </ClinicalRecordDrawer>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {source && (
                  <Box sx={{ display: "flex", minWidth: "100px", alignItems: "baseline", gap: 0.5 }}>
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
      sortable: false,
    }
  ];

  if (!selectedStage) return null;

  const rows = records[selectedStage]?.toSorted((a, b) => {
    return new Date(b.trialStartDate).getTime() - new Date(a.trialStartDate).getTime();
  });
  if (!rows) return null;

  return (
    <>
      <Box
        sx={{
          position: "relative",
          mr: 6,
          "& th": {
            position: "relative !important",
            padding: "0 !important",
            height: "140px",
          },
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
          rows={rows}
          dataDownloader
          // dataDownloaderFileStem="clinical-records"`
          // fixed
          // noWrapHeader={false}
          rowsPerPageOptions={defaultRowsPerPageOptions}
          // loading={loading}
          showGlobalFilter={false}
          // hover={false}
          showColumnVisibilityControl={false}
          showRowsPerPageControl={false}
          // sortBy="trial"
          // order="desc"
        />
      </Box>
    </>
  );
}

export default RecordsCards;