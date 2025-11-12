import { Grid, Box } from "@mui/material";
import { DataDownloader } from "ui";
import BaselineExpressionTable from "./BaselineExpressionTable";
import EXPRESSION_QUERY from "./ExpressionQuery.gql";

export function getData(ensgId, client) {
  return client.query({
    query: EXPRESSION_QUERY,
    variables: { ensemblId: ensgId },
  });
}

const columns = [
  { id: "tissueBiosampleName", label: "Tissue" },
  { id: "celltypeBiosampleName", label: "Cell Type" },
  { id: "median", label: "Median Expression" },
  { id: "unit", label: "Unit" },
  { id: "datasourceId", label: "Data Source" },
];

const getDownloadRows = baselineExpressions =>
  baselineExpressions.map(expression => ({
    tissueBiosampleName: expression.tissueBiosample?.biosampleName || expression.tissueBiosampleFromSource || "N/A",
    celltypeBiosampleName: expression.celltypeBiosample?.biosampleName || expression.celltypeBiosampleFromSource || "N/A",
    median: expression.median,
    unit: expression.unit,
    datasourceId: expression.datasourceId,
  }));

function SummaryTab({ symbol, ensgId, data }) {
  return (
    <Grid container justifyContent="center">
        <BaselineExpressionTable 
          data={data.target.baselineExpression.rows} 
          symbol={symbol}
          DownloaderComponent={
            <DataDownloader
              btnLabel="Export"
              fileStem={`${symbol}-baseline-expression`}
              rows={getDownloadRows(data.target.baselineExpression.rows)}
              query={EXPRESSION_QUERY.loc.source.body}
              variables={{ ensemblId: ensgId }}
              columns={columns}
            />
          }
        />
    </Grid>
  );
}

export default SummaryTab;
