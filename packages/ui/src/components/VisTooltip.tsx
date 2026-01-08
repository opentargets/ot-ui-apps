import { useVisTooltipState } from "../providers/VisTooltipProvider";
import { Box } from "@mui/material";

function VisTooltip({
  width,  
  height,
  
  // following props can be a function: (datum, otherData) => value
  xAnchor = "right",   // "left" | "right" | "center" | "adapt" | "plotLeft" | "plotRight";
  yAnchor = "bottom",  // "top" | "bottom" | "center" | "adapt" | "plotTop" | "plotBottom";
  dx = 0,
  dy = 0,
  position,  // (datum, otherData) => {x, y}, if not used mouse position used as {x, y}
  children
}) {

  const visTooltipState = useVisTooltipState();
  if (!visTooltipState) return null 
  const { datum, otherData, globalXY } = useVisTooltipState();
  if (!datum && !otherData) return null;

  if (typeof xAnchor === "function") xAnchor = xAnchor(datum);
  if (typeof yAnchor === "function") yAnchor = yAnchor(datum);
  if (typeof dx === "function") dx = xAnchor(datum);
  if (typeof dy === "function") dy = xAnchor(datum);

  const {x, y} = position?.(datum, globalXY) ?? globalXY;

  let left, right, transformX;
  if (xAnchor === "plotLeft") {
    left = 0;
  } else if (xAnchor === "plotRight") {
    right = 0;
  } else if (xAnchor === "center") {
    left = x;
    transformX = "-50%";
  } else if (xAnchor === "left" || (xAnchor === "adapt" && x < width / 2)) {
    left = x + dx;
  } else {
    right = width - x + dx;
  }

  let top, bottom, transformY;
  if (yAnchor === "plotTop") {
    top = 0;
  } else if (yAnchor === "plotBottom") {
    bottom = 0;
  } else if (yAnchor === "center") {
    top = y;
    transformY = "-50%";
  } else if (yAnchor === "bottom" || (yAnchor === "adapt" && y > height / 2)) {
    bottom = height - y + dy;
  } else {
    top = y + dy;
  }

  return (
    // <Box
    //   sx={{
    //     width: "100%",
    //     height: "100%",
    //     position: "relative"
    //   }}
    // >
      <Box
        sx={{
          position: "absolute",
          left,
          right,
          top,
          bottom,
          transform: `translate(${transformX ?? 0}, ${transformY ?? 0})`,
          pointerEvents: "auto",
        }}
      >
        {children}
      </Box>
    // </Box>
  );
}

export default VisTooltip;