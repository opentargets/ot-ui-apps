import { Card, CardContent, Grid, Typography } from "@mui/material";
import { DataMetricsTotalCardsProps } from "./types";

const excludeCardPatterns = [
  "Invalid",
  "Duplicate",
  "NullifiedScore",
  "UnresolvedTarget",
  "UnresolvedDisease",
];

function variableToTitle(variable: string): string {
  let name = variable.replace(/TotalCount$/, "");
  name = name.replace(/([A-Z])/g, " $1").replace(/^\s+/, "");
  name = name.charAt(0).toUpperCase() + name.slice(1);
  return `${name.trim()}`;
}

function DataMetricsTotalCards({ metrics, prevMetrics }: DataMetricsTotalCardsProps) {
  // Find all variables in current and previous metrics that should be shown
  const currVars = metrics
    .filter(
      (m) =>
        m.datasourceId === "all" &&
        m.variable &&
        m.variable.endsWith("TotalCount") &&
        !excludeCardPatterns.some((pattern) => m.variable.includes(pattern))
    )
    .map((m) => m.variable);

  const prevVars = prevMetrics
    .filter(
      (pm) =>
        pm.datasourceId === "all" &&
        pm.variable &&
        pm.variable.endsWith("TotalCount") &&
        !excludeCardPatterns.some((pattern) => pm.variable.includes(pattern))
    )
    .map((pm) => pm.variable);

  // Union of variables from current and previous
  const allVars = Array.from(new Set([...currVars, ...prevVars]));

  // Build a list of metric objects for display
  const allMetrics = allVars.map((variable) => {
    const curr = metrics.find((m) => m.datasourceId === "all" && m.variable === variable);
    const prev = prevMetrics.find((pm) => pm.datasourceId === "all" && pm.variable === variable);
    return {
      variable,
      value: curr ? curr.value : 0,
      prevValue: prev ? prev.value : null,
    };
  });

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {allMetrics.map((m) => {
        const currValue = Number(m.value);
        const prevValue = m.prevValue !== null ? Number(m.prevValue) : null;
        let diff = null,
          pct = null;
        if (prevValue !== null && !Number.isNaN(prevValue)) {
          diff = currValue - prevValue;
          pct = prevValue !== 0 ? (diff / prevValue) * 100 : null;
        }
        return (
          <Grid item xs={12} md={4} key={m.variable}>
            <Card>
              <CardContent>
                <Typography variant="h6">{variableToTitle(m.variable)}</Typography>
                <Typography variant="h5" color="primary">
                  {currValue.toLocaleString()}
                </Typography>
                {prevValue !== null && !Number.isNaN(prevValue) && diff !== null && (
                  <Typography
                    variant="body2"
                    color={diff > 0 ? "success.main" : diff < 0 ? "error.main" : "text.secondary"}
                  >
                    {diff > 0 ? "▲" : diff < 0 ? "▼" : ""} {Math.abs(diff).toLocaleString()} (
                    {pct !== null ? pct.toFixed(1) : "-"}% vs prev)
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default DataMetricsTotalCards;
