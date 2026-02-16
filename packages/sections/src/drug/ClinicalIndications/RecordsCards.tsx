import { useState, useEffect } from "react";
import { OtTable } from "ui";
import { Box, Typography } from "@mui/material";
import { defaultRowsPerPageOptions } from "@ot/constants";
import RECORD_DETAIL_QUERY from "./ClinicalRecordsQuery.gql";
import { sentenceCase } from "@ot/utils";
import StageFilter from "./StageFilter";
import ClinicalRecordDrawer from "./ClinicalRecordDrawer";

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
            <ClinicalRecordDrawer record={record}>
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
    sortable: true,
    comparator: (a, b) => {
      return new Date(a.trialStartDate).getTime() - new Date(b.trialStartDate).getTime();
    },
  }
];

function RecordsCards({
  records,
  maxClinicalStage
  // query,
  // variables,
  // loading,
}) {
  const [selectedStage, setSelectedStage] = useState(null);

  useEffect(() => {
    setSelectedStage(maxClinicalStage);
  }, [maxClinicalStage]);

  if (!selectedStage) return null;

  return (
    <>
      <StageFilter
        records={records}
        setSelectedStage={setSelectedStage}
        selectedStage={selectedStage}
        maxStage={maxClinicalStage}
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
          rows={records[selectedStage]}
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
          sortBy="trial"
          order="desc"
        />
      </Box>
    </>
  );
}

export default RecordsCards;