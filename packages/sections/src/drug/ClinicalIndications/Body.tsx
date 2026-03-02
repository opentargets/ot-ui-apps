import { useQuery } from "@apollo/client";
import { Grid, Box } from "@mui/material";
import { SectionItem, PaginationActionsComplete } from "ui";
import { useState } from "react";
import Description from "./Description";
import CLINICAL_INDICATIONS_QUERY from "./ClinicalIndicationsQuery.gql";
import { definition } from ".";
import IndicationsTable from "./IndicationsTable";
import RecordsCards from "./RecordsCards";

function Body({ id: chemblId, label: name, entity }) {
  const variables = { chemblId };
  const request = useQuery(CLINICAL_INDICATIONS_QUERY, { variables });
  
  // records to be showing in 2nd table
  const [records, setRecords] = useState([]);
  const [maxClinicalStage, setMaxClinicalStage] = useState(null);
  const [loadingRecords, setLoadingRecords] = useState(false); 

  const rows = request.data?.drug.indications.rows;

  return (
    <SectionItem
      definition={definition}
      request={request}
      entity={entity}
      renderDescription={() => <Description name={name} />}
      renderBody={() => {
        return (
          <Box sx={{
            display: "flex",
            alignItems: "stretch",
            flexWrap: { xs: "wrap", md: "nowrap" },
            columnGap: { md: 3, lg: 6 },
            rowGap: 3,
            height: '100%',
            "& .MuiCardContent-root": { 
              padding: "0 !important" 
            } 
          }}>
          {/* <Grid container columnSpacing={6} sx={{ height: '100%' }}> */}
            {/* LHS table */}
            <Box
              sx={{
                // height: '100%',
                flex: "0 0 auto",
                width: {
                  xs: "100% ",
                  md: "clamp(250px, 30%, 300px)",
                },
                alignSelf: { md: "stretch" },
                // height: { md: "100%" },
              }}>
              {rows?.length > 0 && (  
                <IndicationsTable
                  chemblId={chemblId}
                  rows={rows}
                  setRecords={setRecords}
                  setLoadingRecords={setLoadingRecords}
                  setMaxClinicalStage={setMaxClinicalStage}
                  query={CLINICAL_INDICATIONS_QUERY.loc.source.body}
                  variables={variables}
                  loading={request.loading}
                />
              )}
            </Box>

            {/* RHS table */}
            <Box sx={{ flex: "1 1 auto", minWidth: 0, }}>
              {records && (
                <RecordsCards
                  records={records}
                  loading={loadingRecords}
                  maxClinicalStage={maxClinicalStage}
                />
              )}
            </Box>
          </Box>
        );
      }}
    />
  );
}

export default Body;