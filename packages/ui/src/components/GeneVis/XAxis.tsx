import { useEffect, useRef } from "react";
import { scaleLinear, axisTop, select, format } from "d3";
import { grey } from "@mui/material/colors";

function XAxis({ start, end, canvasWidth }) {
  const axisRef = useRef(null);

  useEffect(() => {
    const scale = scaleLinear()
      .domain([start, end])
      .range([0, canvasWidth]);

    const kbFormat = format(",");
    const axis = axisTop(scale)
      .ticks(8)
      .tickSizeOuter(0)
      .tickFormat(d => `${kbFormat(+d / 1_000_000)} mb`);

    const axisSelection = select(axisRef.current).call(axis);

    axisSelection.selectAll("text")
      .style("font-size", "11px")
      .style("font-family", "'Inter', sans-serif");
    
    axisSelection.select(".domain")
      .style("stroke", grey[600])
    
    axisSelection.selectAll(".tick line")
      .style("stroke", grey[600])
  }, [start, end, canvasWidth]);

  return (
    <svg width={canvasWidth} height={30} style={{ overflow: "visible" }}>
      <g ref={axisRef} transform="translate(0, 30)" />
    </svg>
  );
}

export default XAxis;