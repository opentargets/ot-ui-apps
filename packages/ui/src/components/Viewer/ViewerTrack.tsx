import { useRef, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useViewerState } from "../../providers/ViewerProvider";
import { useViewerInteractionState, useViewerInteractionDispatch } from "ui";

function svgElement(tag: string) {
  return document.createElementNS("http://www.w3.org/2000/svg", tag);
}

const trackHeight = 7;
const topSpace = 16;
const bottomSpace = 16;
const totalHeight = trackHeight + topSpace + bottomSpace;

// currently for alphaFold only - assumes single/first structure and contiguous
// residue indices from 1 to structure length
export default function ViewerTrack({ trackColor }) {

  const viewerState = useViewerState();
  const viewerInteractionState = useViewerInteractionState();
  const viewerInteractionDispatch = useViewerInteractionDispatch();
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);

  function handlePointerMove(event) {
    const rect = event.target;
    const resi = Number(rect?.dataset?.resi);
    viewerInteractionDispatch({
      type: "setHoveredResi",
      value: resi ?? null,
    });
  }

  function handleMouseleave(event) {
    viewerInteractionDispatch({ type: "setHoveredResi", value: null });
  }

  // add a rectangle for each residue - and a larger invisible rectangle for each hover zone
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    if (!viewerState.viewer || !viewerState.atomsByResi) return;
    const nResidues = viewerState.atomsByResi.size;
    svg.setAttribute("viewBox", `0 0 ${nResidues} ${totalHeight}`);
    const rects = [];
    for (const resi of viewerState.atomsByResi.keys()) {
      const rect = svgElement("rect");
      rect.setAttribute("x", resi - 1);
      rect.setAttribute("y", topSpace);
      rect.setAttribute("width", 1);
      rect.setAttribute("height", trackHeight);
      rect.setAttribute("fill", trackColor(viewerState, resi));
      rect.setAttribute("pointer-events", "none");
      rect.setAttribute("shape-rendering","crispEdges");
      const invisibleRect = svgElement("rect");
      invisibleRect.setAttribute("x", resi - 1);
      invisibleRect.setAttribute("y", 0);
      invisibleRect.setAttribute("width", 1);
      invisibleRect.setAttribute("height", totalHeight);
      invisibleRect.setAttribute("stoke", "none");
      invisibleRect.setAttribute("fill-opacity", 0);  // so can still trigger evevnts
      invisibleRect.setAttribute("data-resi", resi);
      rects.push(rect, invisibleRect);
    }
    svg.append(...rects);
    svg.addEventListener("pointermove", handlePointerMove);
    svg.addEventListener("mouseleave", handleMouseleave);
  }, [viewerState]);

  // hide/show tooltip based on if there is a hoveredResi
  useEffect(() => {
    if (!viewerInteractionState) return;
    const svg = svgRef.current;
    const tooltip = tooltipRef.current;
    if (!svg || !tooltip) return;
    const resi = viewerInteractionState.hoveredResi;
    if (resi) {
      const rect = svg.querySelector(`[data-resi="${resi}"]`);
      if (!rect) {
        tooltip.style.display = "none";
      } else {
        const rectBB = rect.getBoundingClientRect();
        tooltip.textContent = resi;
        tooltip.style.left = `${rectBB.left + rectBB.width / 2 + window.scrollX - 1}px`;
        tooltip.style.top = `${rectBB.top + window.scrollY}px`;
        tooltip.style.display = "block";
      }
    } else {
      tooltip.style.display = "none";
    }
  }, [viewerInteractionState?.hoveredResi]);

  // HANDLE CLICK ON TRACK!!

  if (!viewerInteractionState) return null;

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
      <Typography
        ref={tooltipRef}
        variant="caption"
        sx={{
          position: "absolute",
          pointerEvents: "none",
          height: `${totalHeight}px`,
          borderLeft: "2px solid #888",
          paddingLeft: 0.5,
          lineHeight: 0.9,
          display: "none",
        }} />
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
      {viewerState.atomsByResi?.size || ""}
    </Typography>
  );
}