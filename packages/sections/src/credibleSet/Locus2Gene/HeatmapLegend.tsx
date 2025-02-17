import { useEffect, useRef } from "react";
import * as PlotLib from "@observablehq/plot";
import { Box } from "@mui/material";

function HeatmapLegend({ legendOptions }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const legend = PlotLib.legend(legendOptions);
    containerRef.current?.appendChild(legend);
    return () => {
      containerRef.current?.removeChild(legend);
    };
  }, []);

  return <Box ref={containerRef} />;
}

export default HeatmapLegend;
