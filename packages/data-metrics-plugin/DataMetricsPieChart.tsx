/** biome-ignore-all lint/a11y/noStaticElementInteractions: must be interactive */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: no keyboard interactions desired */
/** biome-ignore-all lint/a11y/useKeyWithMouseEvents: no keyboard interactions desired */
import { Box } from "@mui/material";
import * as d3 from "d3";
import { useRef, useState } from "react";
import { DataMetricsPieChartProps, Tooltip } from "./types";

// Pie chart for datasource metrics
function DataMetricsPieChart({ data, width = 520, height = 520 }: DataMetricsPieChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const [activeLabels, setActiveLabels] = useState<string[]>(data.map((d) => d.label));
  const svgRef = useRef<SVGSVGElement>(null);

  const pie = d3.pie<{ label: string; value: number }>().value((d) => d.value);
  const arc = d3
    .arc()
    .innerRadius(0)
    .outerRadius(Math.min(width, height) / 2 - 10);
  // Use a fixed color palette and assign each label a color based on its index in the original data array
  const colorPalette = d3.schemeCategory10;
  const labelColorMap: Record<string, string> = {};
  data.forEach((d, i) => {
    labelColorMap[d.label] = colorPalette[i % colorPalette.length];
  });
  // Only include active datasources
  const filteredData = data.filter((d) => activeLabels.includes(d.label));
  const pieData = pie(filteredData);
  function handleLegendClick(label: string) {
    setActiveLabels((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  }

  function handleMouseOver(
    d: d3.PieArcDatum<{ label: string; value: number }>,
    i: number
  ) {
    setHoveredIdx(i);
    const [x, y] = arc.centroid(d as any);
    setTooltip({
      x: x + width / 2,
      y: y + height / 2,
      label: d.data.label,
      value: d.data.value,
    });
  }

  function handleMouseOut() {
    setHoveredIdx(null);
    setTooltip(null);
  }

  // Only show label for slices > 6% of total
  const totalValue = filteredData.reduce((sum, d) => sum + d.value, 0);
  const minLabelPercent = 0.06;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Box sx={{ position: "relative" }}>
        <svg ref={svgRef} width={width} height={height}>
          <title>Data Metrics Pie Chart</title>
          <g transform={`translate(${width / 2},${height / 2})`}>
            {pieData.map((d, i) => {
              const percent = d.data.value / totalValue;
              const color = labelColorMap[d.data.label];
              return (
                <g key={d.data.label}>
                  <path
                    d={arc(d as any) ?? undefined}
                    fill={color}
                    stroke={hoveredIdx === i ? "#222" : "#fff"}
                    strokeWidth={hoveredIdx === i ? 3 : 1}
                    style={{
                      cursor: "pointer",
                      opacity: hoveredIdx === null || hoveredIdx === i ? 1 : 0.7,
                    }}
                    onMouseOver={() => handleMouseOver(d, i)}
                    onMouseOut={handleMouseOut}
                  />
                  {/* Only show label if slice is large enough */}
                  {percent > minLabelPercent && (
                    <text
                      transform={`translate(${arc.centroid(d as any)})`}
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      fontSize={14}
                      fill="#fff"
                      pointerEvents="none"
                      style={{ textShadow: "0 1px 4px #000" }}
                    >
                      {d.data.label}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
        {tooltip && (
          <Box
            sx={{
              position: "absolute",
              left: tooltip.x,
              top: tooltip.y,
              background: "rgba(0,0,0,0.85)",
              color: "#fff",
              px: 2,
              py: 1,
              borderRadius: 1,
              pointerEvents: "none",
              fontSize: 14,
              zIndex: 10,
              transform: "translate(-50%, -120%)",
            }}
          >
            <div>
              <strong>{tooltip.label}</strong>
            </div>
            <div>{tooltip.value.toLocaleString()}</div>
          </Box>
        )}
      </Box>
      {/* Legend for all datasources */}
      <Box sx={{ ml: 4, minWidth: 120 }}>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {data.map((d) => {
            const isActive = activeLabels.includes(d.label);
            const color = labelColorMap[d.label];
            // Highlight if hovered in pie (find index in filteredData)
            const filteredIdx = filteredData.findIndex((fd) => fd.label === d.label);
            return (
              <li
                key={d.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 8,
                  opacity: isActive ? 1 : 0.4,
                  cursor: "pointer",
                }}
                onClick={() => handleLegendClick(d.label)}
                title={isActive ? "Click to exclude" : "Click to include"}
              >
                <span
                  style={{
                    width: 18,
                    height: 18,
                    background: color,
                    display: "inline-block",
                    marginRight: 8,
                    borderRadius: 4,
                    border: "1px solid #ccc",
                  }}
                />
                <span
                  style={{
                    fontWeight: hoveredIdx === filteredIdx ? "bold" : "normal",
                    textDecoration: isActive ? "none" : "line-through",
                  }}
                >
                  {d.label}
                </span>
              </li>
            );
          })}
        </ul>
      </Box>
    </Box>
  );
}

export default DataMetricsPieChart;
