import { Typography } from "@mui/material";
import { v1 } from "uuid";
import { Tooltip } from "ui";

const dicSummary = [
  { id: "n_variants", label: "Total variants", tooltip: "Number of harmonised variants" },
  { id: "n_variants_sig", label: "Significant variants", tooltip: "P-value significant variants" },
  { id: "mean_beta", label: "Mean beta", tooltip: "Mean effect size across all variants" },
  {
    id: "gc_lambda",
    label: "GC lambda",
    tooltip: "Additive Genomic Control (GC) lambda indicating GWAS inflation",
  },
  {
    id: "mean_diff_pz",
    label: "Mean diff P-Z",
    tooltip: "Mean difference between reported and calculated log p-values",
  },
  {
    id: "se_diff_pz",
    label: "SD diff P-Z",
    tooltip: "Standard deviation of the difference between reported and calculated log p-values",
  },
];

function formatValue(v: number) {
  return Number.isInteger(v) ? v.toLocaleString() : v.toPrecision(3);
}

export default function SummaryStatsTable({ sumstatQCValues }: any) {
  return (
    <>
      <Typography sx={{ fontSize: 16, fontWeight: 600, my: 1 }} variant="subtitle2">
        Harmonised summary statistics
      </Typography>
      <table>
        <tbody>
          {dicSummary.map((sumstat: any) => {
            const summStatValue = sumstatQCValues.find(
              (v: any) => v.QCCheckName === sumstat.id
            ).QCCheckValue;
            return (
              <tr key={v1()}>
                <td>
                  <Tooltip title={sumstat.tooltip} showHelpIcon>
                    {sumstat.label}
                  </Tooltip>
                </td>
                <Typography sx={{ textAlign: "right" }} component="td" variant="body2">
                  {formatValue(summStatValue)}
                </Typography>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
