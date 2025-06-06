import { Box, Typography } from "@mui/material";
import { alphaFoldConfidenceBands, alphaFoldPathogenicityColorScale } from "@ot/constants";

export default function AlphaFoldPathogenicityLegend({ showTitle = true }) {
  const barWidth = 340;
  const barHeight = 11;

  const stops = [];
  for (let t = 0; t <= 1.005; t += 0.01) {
    stops.push({
      offset: `${t * 100}%`,
      color: alphaFoldPathogenicityColorScale(t),
    });
  }

  const domain = alphaFoldPathogenicityColorScale.domain();

  const gradientId = "color-gradient";
  const fontSize = 12;
  const textColor = "#5a5f5f";

  return (
    <Box display="flex">
      <Box display="flex" flexDirection="column" pt={0.5} gap={0.75}>
        {showTitle && <Typography variant="subtitle2">Model Confidence</Typography>}
        <Box display="flex" gap={3.5}>
          <svg width={barWidth + 10} height={barHeight + 30} style={{ borderRadius: "2px" }}>
            <g transform="translate(5,0)">
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
                rx={2}
                ry={2}
                width={barWidth}
                height={barHeight}
                fill={`url(#${gradientId})`}
                stroke="none"
              />
              <g transform={`translate(0, ${barHeight + 20})`}>
                {domain.map((t, i) => (
                  <text
                    key={i}
                    x={t * barWidth}
                    y={0}
                    fontSize={fontSize}
                    fill={textColor}
                    textAnchor="middle"
                    alignmentBaseline="hanging"
                  >
                    {t}
                  </text>
                ))}
              </g>
              <g transform={`translate(0, ${barHeight + 4})`}>
                {["likely benign", "uncertain", "likely pathogenic"].map((label, i) => (
                  <text
                    x={((domain[i] + domain[i + 1]) * barWidth) / 2}
                    y={0}
                    fontSize={fontSize}
                    fill={textColor}
                    textAnchor="middle"
                    alignmentBaseline="hanging"
                  >
                    {label}
                  </text>
                ))}
              </g>
              {domain.map((t, i) => (
                <line
                  key={i}
                  x1={t * barWidth}
                  x2={t * barWidth}
                  y1={0}
                  y2={barHeight + 16}
                  stroke={textColor}
                  strokeWidth={1}
                />
              ))}
            </g>
          </svg>
        </Box>
        <Typography variant="caption" mt={1}>
          The displayed colour for each residue is the average AlphaMissense pathogenicity score
          across all possible amino acid substitutions at that position.
        </Typography>
      </Box>
    </Box>
  );
}
