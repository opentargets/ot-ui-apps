import { useQuery } from "@apollo/client";

import localData from "./clinical_indication_CHEMBL102.json"  // !! IMPORT LOCAL DATA FOR NOW !!
// import localData from "./clinical_indication_CHEMBL2105708.json"  // !! IMPORT LOCAL DATA FOR NOW !!
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

  const rows = localData;  // !! CHECNGE TO ROWS FROM REQUEST WHEN HAVE API !!

  return (
    <SectionItem
      definition={definition}
      request={request}
      entity={entity}
      renderDescription={() => <Description name={name} />}
      renderBody={() => {
        return (
          <Box sx={{ 
            height: '100%',
            "& .MuiCardContent-root": { 
              padding: "0 !important" 
            } 
          }}>
            <Grid container columnSpacing={6} sx={{ height: '100%' }}>
              {/* LHS table */}
              <Grid item xs={12} md={4} sx={{ height: '100%' }}>
                {rows?.length > 0 && (  
                  <IndicationsTable
                    rows={rows}
                    setRecords={setRecords}
                    setMaxClinicalStage={setMaxClinicalStage}
                    query={CLINICAL_INDICATIONS_QUERY.loc.source.body}
                    variables={variables}
                    loading={request.loading}
                  />
                )}
              </Grid>

              {/* RHS table */}
              <Grid item xs={12} md={8}>
                {records && (
                  <RecordsCards records={records} maxClinicalStage={maxClinicalStage} />
                )}
              </Grid>
            </Grid>
          </Box>
        );
      }}
    />
  );
}

export default Body;