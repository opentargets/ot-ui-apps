import { useEffect, useRef } from "react";
import * as PlotLib from "@observablehq/plot";
import { Box, Typography } from "@mui/material";

function HeatmapLegend({ legendOptions }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const legend = PlotLib.legend(legendOptions);
    containerRef.current?.appendChild(legend);
    return () => {
      containerRef.current?.removeChild(legend);
    };
  }, []);

  return (
    <Box>
      <Typography variant="subtitle2">Feature contributions (Shapley)</Typography>
      <Box position="relative" top="-12px" ref={containerRef} />
    </Box>
  );
}

export default HeatmapLegend;
