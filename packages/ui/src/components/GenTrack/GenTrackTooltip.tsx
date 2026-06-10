import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useGenTrackTooltipState, useGenTrackTooltipDispatch } from "../../providers/GenTrackTooltipProvider";
import { Box, IconButton } from "@mui/material";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function GenTrackTooltip({
  width,  
  height,
  canvasType,
  
  // following props can be a function: (datum, otherData) => value
  xAnchor = "right",   // "left" | "right" | "center" | "adapt" | "plotLeft" | "plotRight";
  yAnchor = "bottom",  // "top" | "bottom" | "center" | "adapt" | "plotTop" | "plotBottom";
  dx = 0,
  dy = 0,
  tooltipWidth = 0,
  scalesRef = null,    // optional: when provided + sticky, tooltip X tracks gene during pan/zoom
  children
}) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const tooltipBoxRef = useRef<HTMLDivElement | null>(null);
  const genTrackTooltipDispatch = useGenTrackTooltipDispatch() as unknown as (action: { type: string; value?: any }) => void;

  const genTrackTooltipState = useGenTrackTooltipState();
  const { datum, otherData, globalXY, activeCanvas, sticky, stickyGenomicX, stickyLabelCenter } = (genTrackTooltipState as any) ?? {};

  // rAF loop: while sticky, track gene X (pan/zoom) + Y (scroll) imperatively, and auto-dismiss when needed
  // MUST be before any conditional returns (Rules of Hooks)
  useEffect(() => {
    if (!sticky || !scalesRef || stickyGenomicX == null) return;
    const initialScales = (scalesRef as any)?.current;
    // Capture view state at sticky start — used to detect pan/zoom and resize
    const initialCanvasWidth = initialScales?.canvasWidth ?? 0;
    const initialXOffset = initialScales?.xOffset ?? 0;
    const initialXScale  = initialScales?.xScale  ?? 1;
    // Classify gene by pixel size at click time to pick dismissal strategy.
    // Tiny genes (sub-pixel wide at current zoom) use label-center visibility;
    // normal/large genes use the 10px pixel-visibility check.
    const genStart: number = (datum as any)?.genomicLocation?.start ?? 0;
    const genEnd: number = (datum as any)?.genomicLocation?.end ?? 0;
    const initialGenePixels = genEnd > genStart ? (genEnd - genStart) * initialXScale : 0;
    const isTinyGene = initialGenePixels < 10;
    let rafId: number;
    const update = () => {
      const box = tooltipBoxRef.current;
      const scales = (scalesRef as any)?.current;
      const anchor = anchorRef.current;
      if (box && scales && anchor) {
        // Dismiss if widget was resized
        if (scales.canvasWidth !== initialCanvasWidth) {
          genTrackTooltipDispatch({ type: "clearSticky" });
          return;
        }
        // Dismiss when gene is no longer meaningfully in view — but ONLY after a real pan/zoom.
        const hasViewChanged = scales.xOffset !== initialXOffset || scales.xScale !== initialXScale;
        if (hasViewChanged) {
          const viewStart = -scales.xOffset / scales.xScale;
          const viewEnd = (scales.canvasWidth - scales.xOffset) / scales.xScale;
          if (!isTinyGene) {
            // Gene was large at click time: dismiss when < 10px of genomic extent is visible
            const visibleGenomic = Math.max(0, Math.min(genEnd, viewEnd) - Math.max(genStart, viewStart));
            const visiblePixels = visibleGenomic * scales.xScale;
            if (visiblePixels < 10) {
              genTrackTooltipDispatch({ type: "clearSticky" });
              return;
            }
          } else if (stickyLabelCenter != null) {
            // Tiny gene (< 10px at click time): dismiss when label center goes out of view
            if (stickyLabelCenter < viewStart || stickyLabelCenter > viewEnd) {
              genTrackTooltipDispatch({ type: "clearSticky" });
              return;
            }
          }
        }
        // X: track gene genomic position through pan/zoom
        const anchorRect = anchor.getBoundingClientRect();
        const originXV = anchorRect.left;
        const screenX = stickyGenomicX * scales.xScale + scales.xOffset;
        let newLeft: number;
        if (xAnchor === "right" || (xAnchor === "adapt" && screenX > width / 2)) {
          newLeft = originXV + screenX - tooltipWidth + dx;
        } else {
          newLeft = originXV + screenX + dx;
        }
        if (newLeft < 0) newLeft = 0;
        box.style.left = `${newLeft}px`;
        // Y: recompute from boxTopPageY each frame to follow page scroll
        if (globalXY?.boxTopPageY != null) {
          const newTop = globalXY.boxTopPageY - window.scrollY - (dy || 4);
          box.style.top = `${newTop}px`;
          box.style.transform = "translateY(-100%)";
        }
      }
      rafId = requestAnimationFrame(update);
    };
    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [sticky, scalesRef, stickyGenomicX, stickyLabelCenter, datum, globalXY, xAnchor, tooltipWidth, dx, dy, width, genTrackTooltipDispatch]);

  if (!genTrackTooltipState) return <div ref={anchorRef} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />;
  if (!datum && !otherData) return <div ref={anchorRef} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />;
  if (activeCanvas !== canvasType) return <div ref={anchorRef} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />;

  if (typeof xAnchor === "function") xAnchor = xAnchor(datum);
  if (typeof yAnchor === "function") yAnchor = yAnchor(datum);
  if (typeof dx === "function") dx = xAnchor(datum);
  if (typeof dy === "function") dy = xAnchor(datum);

  const { x, y, boxTopPageY } = globalXY;

  // All coordinates are viewport-relative (position: fixed), which avoids all scroll/page-coord issues.
  const anchorRect = anchorRef.current?.getBoundingClientRect();
  const originXV = anchorRect?.left ?? 0; // viewport X of canvas left edge
  const originYV = anchorRect?.top ?? 0;  // viewport Y of canvas top edge

  // Compute viewport-left X
  let fixedLeft: number;
  if (xAnchor === "plotLeft") {
    fixedLeft = originXV;
  } else if (xAnchor === "plotRight") {
    fixedLeft = originXV + width - tooltipWidth;
  } else if (xAnchor === "center") {
    fixedLeft = originXV + x - tooltipWidth / 2;
  } else if (xAnchor === "left" || (xAnchor === "adapt" && x < width / 2)) {
    fixedLeft = originXV + x + dx;
  } else {
    fixedLeft = originXV + x - tooltipWidth + dx;
  }
  // Clamp left edge to viewport
  if (fixedLeft < 0) fixedLeft = 0;

  // Compute viewport-top Y — boxTopPageY is page-absolute, convert to viewport
  let fixedTop: number;
  let transformY: string | undefined;
  if (yAnchor === "plotTop") {
    fixedTop = originYV;
  } else if (yAnchor === "plotBottom") {
    fixedTop = originYV + height;
    transformY = "-100%";
  } else if (yAnchor === "center") {
    fixedTop = originYV + y;
    transformY = "-50%";
  } else if (yAnchor === "boxTop" && boxTopPageY !== undefined) {
    // boxTopPageY is page-absolute; convert to viewport by subtracting scrollY
    fixedTop = boxTopPageY - window.scrollY - (dy || 4);
    transformY = "-100%";
  } else if (yAnchor === "bottom" || (yAnchor === "adapt" && y > height / 2)) {
    fixedTop = originYV + y - dy;
    transformY = "-100%";
  } else {
    fixedTop = originYV + y + dy;
  }

  return (
    <>
      <div ref={anchorRef} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
      {anchorRef.current && createPortal(
        <Box
          ref={tooltipBoxRef}
          onClick={e => e.stopPropagation()}
          sx={{
            position: "fixed",
            left: fixedLeft,
            top: fixedTop,
            transform: transformY ? `translateY(${transformY})` : undefined,
            pointerEvents: "auto",
            zIndex: 9999,
          }}
        >
          {sticky && (
            <IconButton
              size="small"
              onClick={() => genTrackTooltipDispatch({ type: "clearSticky" })}
              sx={{
                position: "absolute",
                top: 2,
                right: 2,
                padding: "2px",
                zIndex: 1,
                color: "grey.600",
                "&:hover": { color: "grey.900", backgroundColor: "rgba(0,0,0,0.04)" },
              }}
            >
              <FontAwesomeIcon icon={faXmark} style={{ fontSize: "0.75rem" }} />
            </IconButton>
          )}
          {children}
        </Box>,
        document.body
      )}
    </>
  );
}

export default GenTrackTooltip;