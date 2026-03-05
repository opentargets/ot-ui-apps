import { Box, Typography } from "@mui/material";
import { alphaFoldPathogenicityColorScale } from "@ot/constants";

export default function AlphaFoldPathogenicityLegend({ showTitle = true }) {
  const barWidth = 330;
  const barHeight = 11;

  const stops = [];
  for (let t = 0; t <= 1.005; t += 0.01) {
    stops.push({
      offset: `${t * 100}%`,
      color: alphaFoldPathogenicityColorScale(t),
    });
  }

  const primaryDomain = alphaFoldPathogenicityColorScale._primaryDomain;

  const gradientId = "color-gradient";
  const fontSize = 11.5;
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
                {primaryDomain.map((t, i) => (
                  <text
                    key={i}
                    x={t * barWidth}
                    y={0}
                    fontSize={fontSize}
                    fill={textColor}
                    textAnchor="middle"
                    dominantBaseline="hanging"
                  >
                    {t}
                  </text>
                ))}
              </g>
              <g transform={`translate(0, ${barHeight + 4})`}>
                {["likely benign", "uncertain", "likely pathogenic"].map((label, i) => (
                  <text
                    key={i}
                    x={((primaryDomain[i] + primaryDomain[i + 1]) * barWidth) / 2}
                    y={0}
                    fontSize={fontSize}
                    fill={textColor}
                    textAnchor="middle"
                    dominantBaseline="hanging"
                  >
                    {label}
                  </text>
                ))}
              </g>
              {primaryDomain.map((t, i) => (
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
      </Box>
    </Box>
  );
}
