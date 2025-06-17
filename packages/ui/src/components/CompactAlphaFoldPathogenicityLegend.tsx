import { Box, Typography } from "@mui/material";
import { alphaFoldPathogenicityColorScale } from "@ot/constants";
import { DetailPopover, AlphaFoldPathogenicityLegend } from "ui";

export default function CompactAlphaFoldPathogenicityLegend({ showTitle = true }) {
  const barWidth = 70;
  const barHeight = 11;

  const stops = [];
  for (let t = 0; t <= 1.005; t += 0.01) {
    stops.push({
      offset: `${t * 100}%`,
      color: alphaFoldPathogenicityColorScale(t),
    });
  }

  const gradientId = "color-gradient";

  return (
    <Box sx={{ display: "flex", gap: 1, justifyContent: "end", alignItems: "center" }}>
      <Box sx={{ display: "flex", gap: 1, alignItems: "end" }}>
        {showTitle && <Typography variant="caption">AlphaFold model pathogenicity:</Typography>}
        <Box sx={{ display: "flex", gap: 0.75, alignItems: "center" }}>
          <Typography variant="caption">likely benign</Typography>
          <svg width={barWidth} height={barHeight} style={{ borderRadius: "2px" }}>
            <defs>
              <linearGradient id={gradientId} x1="0%" x2="100%" y1="0%" y2="0%">
                {stops.map((stop, i) => (
                  <stop key={i} offset={stop.offset} stopColor={stop.color} />
                ))}
              </linearGradient>
            </defs>
            <rect
              x={0}
              y={0}
              width={barWidth}
              height={barHeight}
              fill={`url(#${gradientId})`}
              stroke="none"
            />
            {/* Optional axis labels */}
            <g transform={`translate(0, ${barHeight + 5})`}>
              <text x={0} y={10} fontSize={10}>
                0
              </text>
              <text x={barWidth - 20} y={10} fontSize={10}>
                1
              </text>
            </g>
          </svg>
          <Typography variant="caption">likely pathogenic</Typography>
        </Box>
      </Box>
      <Box sx={{ width: "10px" }}>
        <DetailPopover title="">
          <Box sx={{ maxWidth: "520px" }}>
            <AlphaFoldPathogenicityLegend showTitle={false} />
          </Box>
        </DetailPopover>
      </Box>
    </Box>
  );
}
