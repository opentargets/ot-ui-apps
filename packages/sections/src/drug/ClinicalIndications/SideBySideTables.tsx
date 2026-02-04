import { useState, useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import { Link, DataTable } from "ui";
import { defaultRowsPerPageOptions } from "@ot/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

import clinicalRecordsData from "./clinical_record_CHEMBL2105708.json";  // !! LOCAL DATA FOR NOW !!
import CLINICAL_RECORDS_QUERY from "./ClinicalRecordsQuery.gql";
import IndicationsTable from "./IndicationsTable";
import RecordsTable from "./RecordsTable";

const getData = (query, chemblId) =>   // WILL NEED TO PUT ACTUAL PARAMETERS HERE !!
  client.query({
    query,
    variables: {
      chemblId,
    },
  });

const onLinkClick = (e: any) => {
  e.stopPropagation();
};

function SideBySideTables({
  rows,
  query,
  variables,
  loading
}) {

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

  return (
    <>
      <Grid container spacing={10}>
        <Grid item xs={12} md={5}>
          {rows?.length > ) && (
            <IndicationsTable />
          )}
        </Grid>

        <Grid item xs={12} md={7}>
          {recordsRows && (
            <RecordsTable records={records}/>
          )}
        </Grid>
      </Grid>
    </>
  );
}

export default SideBySideTables;