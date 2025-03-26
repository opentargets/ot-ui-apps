import { useEffect, useRef } from "react";
import * as PlotLib from "@observablehq/plot";
import { Box, Typography } from "@mui/material";
import { Tooltip, Link } from "ui";

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
    <Box position="relative">
      <Tooltip
        showHelpIcon
        title={
          <>
            See{" "}
            <Link
              external
              to="https://platform-docs.opentargets.org/gentropy/locus-to-gene-l2g#explaining-l2g-predictions"
            >
              here
            </Link>{" "}
            for more details.
          </>
        }
      >
        <Typography variant="subtitle2" component="span">
          Feature contributions (Shapley)
        </Typography>
      </Tooltip>
      <Box position="relative" top="-12px" ref={containerRef} />
    </Box>
  );
}

export default HeatmapLegend;
