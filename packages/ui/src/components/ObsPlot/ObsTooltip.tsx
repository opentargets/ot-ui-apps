import { ReactElement, useEffect } from "react";
import { Box } from "@mui/material";

type ObsTooltipProps = {
  width: number;
  height: number;
  xAnchor?: "left" | "right" | "center" | "adapt";
  yAnchor?: "top" | "bottom" | "center" | "adapt";
  dx?: number;
  dy?: number;
  xAccessor: (d: any, i?: number) => number | string;
  yAccessor: (d: any, i?: number) => number | string;
  chart: ReactElement;
  datum: any;
  renderTooltip: (datum: any) => ReactElement;
};

function ObsTooltip({
  width,
  height,
  xAnchor = "adapt",
  yAnchor = "adapt",
  dx = 0, // +ve value distances tooltip from anchor point - ignored if centered
  dy = 0,
  xAccessor,
  yAccessor,
  chart,
  datum,
  renderTooltip,
}: ObsTooltipProps) {
  if (!datum) return null;

  const x = chart.scale("x").apply(xAccessor(datum));
  const y = chart.scale("y").apply(yAccessor(datum));

  let left, right, top, bottom, transformX, transformY;
  if (xAnchor === "center") {
    left = x;
    transformX = "-50%";
  } else if (xAnchor === "left" || (xAnchor === "adapt" && x < width / 2)) {
    left = x + dx;
  } else {
    right = width - x + dx;
  }
  if (yAnchor === "center") {
    top = y;
    transformY = "-50%";
  } else if (yAnchor === "bottom" || (yAnchor === "adapt" && y > height / 2)) {
    bottom = height - y + dy;
  } else {
    top = y + dy;
  }

  return (
    <Box
      width={width}
      height={height}
      position="absolute"
      top={0}
      left={0}
      sx={{ pointerEvents: "none" }}
    >
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
        {renderTooltip(datum)}
      </Box>
    </Box>
  );
}

export default ObsTooltip;
