import { useEffect, useState } from "react";
import { Box, Chip, CircularProgress, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import { useAotfQueryState } from "../../context/AssociationsQueryContext";
import { OverallChart, SourcesChart, useNoveltyTimeSeries } from "./NoveltyCharts";

const CHART_HEIGHT = 150;

interface NoveltyInlinePanelProps {
  rowId: string;
}

export function NoveltyInlinePanel({ rowId }: NoveltyInlinePanelProps) {
  const { id: parentId, entity, enableIndirect } = useAotfQueryState();
  const theme = useTheme();

  const targetId = entity === "target" ? parentId : rowId;
  const diseaseId = entity === "target" ? rowId : parentId;

  const { overallRows, dsRows, dsLabels, xDomain, loading, error, targetName, diseaseName } =
    useNoveltyTimeSeries({ targetId, diseaseId, isDirect: !enableIndirect, skip: false });

  const [selectedLabels, setSelectedLabels] = useState<Set<string>>(new Set());
  useEffect(() => {
    setSelectedLabels(new Set(dsLabels));
  }, [dsLabels.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleLabel = (label: string) => {
    setSelectedLabels(prev => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const filteredDsRows = dsRows.filter(r => selectedLabels.has(r.label));

  return (
    <Box sx={{ background: grey[100], px: 3, py: 5 }}>
      {/* Title + help text */}
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="subtitle2">
          Novelty Trend
          {targetName && diseaseName && (
            <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              {targetName} · {diseaseName}
            </Typography>
          )}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.25 }}>
          Novelty scores how recently discovered the evidence is — 0 (well-established) to 1
          (newly emerging). Overall aggregates all sources; the right panel breaks it down by
          data source.
        </Typography>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
          <CircularProgress size={24} />
        </Box>
      )}
      {error && (
        <Typography color="error" variant="caption">
          Failed to load: {error.message}
        </Typography>
      )}

      {!loading && !error && (overallRows.length > 0 || dsRows.length > 0) && (
        <Box sx={{ display: "flex", gap: 0 }}>

          {/* Overall — 50%, flex column so chart snaps to bottom */}
          <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
              Overall
            </Typography>
            <Box sx={{ mt: "auto" }}>
              <OverallChart
                rows={overallRows}
                xDomain={xDomain}
                color={theme.palette.primary.main}
                height={CHART_HEIGHT}
                plotWidth={500}
                showArea={false}
              />
            </Box>
          </Box>

          <Box sx={{ width: "1px", background: grey[300], mx: 2, flexShrink: 0 }} />

          {/* By data source — 50%, flex column so chart snaps to bottom */}
          <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
            <Box>
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  By data source
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  · click to toggle
                </Typography>
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 0.75 }}>
                {dsLabels.map(label => (
                  <Chip
                    key={label}
                    label={label}
                    size="small"
                    onClick={() => toggleLabel(label)}
                    variant={selectedLabels.has(label) ? "filled" : "outlined"}
                    sx={{ fontSize: 11, height: 20, transition: "all 150ms ease" }}
                  />
                ))}
              </Box>
            </Box>
            <Box sx={{ mt: "auto" }}>
              <SourcesChart
                rows={filteredDsRows}
                dsLabels={dsLabels}
                xDomain={xDomain}
                height={CHART_HEIGHT}
                plotWidth={500}
                showLegend={false}
              />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
