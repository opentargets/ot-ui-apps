import { Alert, AlertTitle, Grid, Typography } from "@mui/material";
import { DataDownloader } from "ui";
import BaselineExpressionTable from "./BaselineExpressionTable";
import EXPRESSION_QUERY from "./ExpressionQuery.gql";
import { processData } from "./processData";

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

const getDownloadRows = (baselineExpressions) =>
  baselineExpressions.map((expression) => ({
    tissueBiosampleName: expression.tissueBiosample?.biosampleName,
    tissueBiosampleId: expression.tissueBiosample?.id,
    tissueBiosampleFromSource: expression.tissueBiosampleFromSource,
    celltypeBiosampleName: expression.celltypeBiosample?.biosampleName,
    celltypeBiosampleId: expression.celltypeBiosample?.id,
    celltypeBiosampleFromSource: expression.celltypeBiosampleFromSource,
    median: expression.median,
    datasourceId: expression.datasourceId,
    datatypeId: expression.datatypeId,
    specificityScore: expression.specificity_score,
    distributionScore: expression.distributionScore,
    unit: expression.unit,
  }));

function SummaryTab({ symbol, ensgId, data }) {
  if (!data) return null;

  const datatypes = ["scrna-seq", "bulk rna-seq", "mass-spectrometry proteomics"];
  const processedData = {
    tissue: processData(data.target.baselineExpression.rows, datatypes, true),
    celltype: processData(data.target.baselineExpression.rows, datatypes, false),
  };

  // !! REMOVE !!
  window.processedData = processedData;

  return (
    <Grid container justifyContent="center">
      <BaselineExpressionTable
        data={processedData}
        datatypes={datatypes}
        specificityThreshold={0.75}
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
