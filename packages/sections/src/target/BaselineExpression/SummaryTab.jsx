import { Grid } from "@mui/material";
import ExpressionDataDownloader from "./ExpressionDataDownloader";
import BaselineExpressionTable from "./BaselineExpressionTable";
import EXPRESSION_QUERY from "./ExpressionQuery.gql";

export function getData(ensgId, client) {
  return client.query({
    query: EXPRESSION_QUERY,
    variables: { ensemblId: ensgId },
  });
}

const headers = [
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

function SummaryTab({ symbol, data }) {
  console.log("data", data);
  return (
    <Grid container justifyContent="center">
      <ExpressionDataDownloader
        tableHeaders={headers}
        rows={getDownloadRows(data.target.baselineExpression.rows)}
        fileStem={`${symbol}-baseline-expression`}
      />
      <Grid item xs={12} md={10}>
        <BaselineExpressionTable 
          data={data.target.baselineExpression.rows} 
          symbol={symbol}
        />
      </Grid>
    </Grid>
  );
}

export default SummaryTab;
