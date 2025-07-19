import { useRef, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useViewerState, useViewerDispatch } from "../../providers/ViewerProvider";

function svgElement(tag: string) {
  return document.createElementNS("http://www.w3.org/2000/svg", tag);
}

const trackHeight = 7;
const topSpace = 16;
const bottomSpace = 16;
const totalHeight = trackHeight + topSpace + bottomSpace;

// currently for alphaFold only - assumes single/first structure and contiguous
// residue indices from 1 to structure length
export default function ViewerTrack() {

  const viewerState = useViewerState();
  const viewerDispatch = useViewerDispatch();
  const svgRef = useRef(null);

  // add a rectangle for each residue to the svg
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    if (!viewerState.trackColor?.length) return;
    svg.setAttribute("viewBox", `0 0 ${viewerState.trackColor.length} ${totalHeight}`);
    svg.append(...viewerState.trackColor.map((color, index) => {
      const rect = svgElement("rect");
      rect.addEventListener(
        "mouseenter",
        () => viewerDispatch({ type: "_setHoveredResi", value: index + 1 })
      );
      rect.addEventListener(
        "mouseleave",
        () => viewerDispatch({ type: "_setHoveredResi", value: null })
      );
      rect.addEventListener(
        "click",
        () => viewerDispatch({ type: "_setClickedResi", value: index + 1 })
      );
      rect.setAttribute("x", index);
      rect.setAttribute("y", topSpace);
      rect.setAttribute("width", 1);
      rect.setAttribute("height", trackHeight);
      rect.setAttribute("stroke",color);
      // rect.setAttribute("shape-rendering","crispEdges");
      return rect;
    }));
  }, [viewerState.trackColor]);

  // highlight position
  const prevHoveredResi = useRef({});
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const hoveredResi = viewerState.hoveredResi ?? viewerState.hoveredAtom;
    if (!hoveredResi) {
      svg.querySelector(".position-highlight")?.remove();
      prevHoveredResi.current.resi = null;
      return
    } else if (hoveredResi === prevHoveredResi.current.resi) {
      return;
    }
    svg.querySelector(".position-highlight")?.remove();
    const g = svgElement("g");
    g.classList.add("position-highlight");
    g.setAttribute("transform", `translate(${hoveredResi - 0.5} ${topSpace})`);
    g.setAttribute("pointer-events", "none");
    svg.append(g);
    const line = svgElement("line");
    line.setAttribute("x1", 0);
    line.setAttribute("x2", 0);
    line.setAttribute("y1", -topSpace / 3);
    line.setAttribute("y2", trackHeight + bottomSpace / 3);
    line.setAttribute("stroke-width", 2);
    line.setAttribute("stroke", "black");
    line.setAttribute("vector-effect", "non-scaling-stroke");
    g.append(line);
    const foreignObject = document.createElementNS(
      "http://www.w3.org/1999/xhtml",
      "foreignObject"
    );
    foreignObject.setAttribute("width", "100");
    foreignObject.setAttribute("height", "100");
    foreignObject.innerHTML = `
    <body xmlns="http://www.w3.org/1999/xhtml">
      <div style="font-size: 18px; font-family: sans-serif; color: darkblue; background: lime">
        Hello from <strong>foreignObject</strong>!
      </div>
    </body>
    `;
    g.append(foreignObject);
    prevHoveredResi.current.resi = hoveredResi;
  }, [viewerState.hoveredResi, viewerState.hoveredAtom])

	return (
    <Box sx={{
      height: `${totalHeight}px`,
      display: "flex",
      alignItems: "center",
      gap: 0.75
    }}>
      <Box sx={{ flex: 1 }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 100 ${totalHeight}`}
          preserveAspectRatio="none"
          style={{
            width: "100%",
            height: `${totalHeight}px`,
          }}
        >  
          {/* rectangles and highlight added by useEffect */}
        </svg>
      </Box>
      <ResidueLength />
    </Box>
  );
}

function ResidueLength() {
  const viewerState = useViewerState();
  return (
    <Typography
      variant="caption"
      sx={{ flex: 0, mt: `-${trackHeight - 2}px` }}
    >
      {viewerState.trackColor?.length ?? ""}
    </Typography>
  );
}