import { useEffect } from "react";
import { scaleLinear, axisTop, select } from "d3";

function XAxis({ start, end, canvasWidth }) {
  const axisRef = useRef(null);

  useEffect(() => {
    const scale = scaleLinear()
      .domain([start, end])
      .range([0, canvasWidth]);

    const axis = axisTop(scale)
      .ticks(8)
      .tickSizeOuter(0);

    const axisSelection = select(axisRef.current).call(axis);

    axisSelection.selectAll("text")
      .style("font-size", "11px")
      .style("font-family", "'Inter', sans-serif");
    
    axisSelection.select(".domain")
      .style("stroke", "#000")
      .style("opacity", 0.5);
    
    axisSelection.selectAll(".tick line")
      .style("stroke", "#000")
      .style("opacity", 0.5);
  }, [start, end, canvasWidth]);

  return (
    <svg width={canvasWidth} height={30} style={{ overflow: "visible" }}>
      <g ref={axisRef} transform="translate(0, 30)" />
    </svg>
  );
}

export default XAxis;