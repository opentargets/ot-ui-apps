import { useQuery } from "@apollo/client";

import localData from "./clinical_indication_CHEMBL2105708.json"  // !! IMPORT LOCAL DATA FOR NOW !!
import { Grid } from "@mui/material";
import { SectionItem, PaginationActionsComplete, OtTable } from "ui";
import { sourceMap, phaseMap } from "@ot/constants";
import { referenceUrls } from "@ot/utils";

import { useState } from "react";
import Description from "./Description";
import CLINICAL_INDICATIONS_QUERY from "./ClinicalIndicationsQuery.gql";
import { definition } from ".";
import IndicationsTable from "./IndicationsTable";
import RecordsTable from "./RecordsTable";
import RecordsCards from "./RecordsCards";

function Body({ id: chemblId, label: name, entity }) {
  const variables = { chemblId };
  const request = useQuery(CLINICAL_INDICATIONS_QUERY, { variables });
  
  // records to be showing in 2nd table
  const [records, setRecords] = useState([]);

  const rows = localData;  // !! CHECNGE TO ROWS FROM REQUEST WHEN HAVE API !!

  return (
    <SectionItem
      definition={definition}
      request={request}
      entity={entity}
      renderDescription={() => <Description name={name} />}
      renderBody={() => {
        return (
          <Grid container spacing={8}>
            {/* LHS table */}
            <Grid item xs={12} md={5}>
              {rows?.length > 0 && (  
                <IndicationsTable
                  rows={rows}
                  setRecords={setRecords}
                  query={CLINICAL_INDICATIONS_QUERY.loc.source.body}
                  variables={variables}
                  loading={request.loading}
                />
              )}
            </Grid>

            {/* RHS table */}
            <Grid item xs={12} md={7}>
              {records && (
                <RecordsCards records={records}/>
              )}
            </Grid>
          </Grid>
        );
      }}
    />
  );
}

export default Body;