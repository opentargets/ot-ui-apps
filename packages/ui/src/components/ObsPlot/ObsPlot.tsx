import { ReactElement, useState } from "react";
import { useMeasure } from "@uidotdev/usehooks";
import { Box, Fade } from "@mui/material";
import { ObsChart, ObsTooltip } from "ui";

type ObsPlotProps = {
  data: any;
  otherData?: any;
  minWidth?: number;
  maxWidth?: number;
  height: number;
  renderChart: (param: { data: any; otherData?: any; height: number }) => SVGSVGElement;
  xTooltip?: (d: any, i?: number) => number;
  yTooltip?: (d: any, i?: number) => number;
  xAnchorTooltip?: "left" | "right" | "center" | "adapt" | "plotLeft" | "plotRight";
  yAnchorTooltip?: "top" | "bottom" | "center" | "adapt" | "plotTop" | "plotBottom";
  dxTooltip?: number;
  dyTooltip?: number;
  renderTooltip?: (datum: any) => ReactElement;
  fadeElement?: (elmt: SVGElement) => void;
  highlightElement?: (elmt: SVGElement) => void;
  resetElement?: (elmt: SVGElement) => void;
};

function ObsPlot({
  data,
  otherData,
  minWidth,
  maxWidth,
  height,
  renderChart,
  xTooltip,
  yTooltip,
  xAnchorTooltip,
  yAnchorTooltip,
  dxTooltip,
  dyTooltip,
  renderTooltip,
  fadeElement,
  highlightElement,
  resetElement,
}: ObsPlotProps) {
  const [ref, { width: measuredWidth }] = useMeasure();
  const [chart, setChart] = useState(null);
  const [datum, setDatum] = useState(null);

  const hasTooltip = Boolean(xTooltip && yTooltip && renderTooltip);

  let width = measuredWidth;
  if (maxWidth != null) width = Math.min(width, maxWidth);
  if (minWidth != null) width = Math.max(width, minWidth);

  return (
    <div>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
        ref={ref}
      >
        <Box sx={{ width }}>
          <Fade in>
            <div>
              <ObsChart
                data={data}
                otherData={otherData}
                width={width}
                height={height}
                renderChart={renderChart}
                hasTooltip={hasTooltip}
                fadeElement={fadeElement}
                highlightElement={highlightElement}
                resetElement={resetElement}
                setChart={setChart}
                setDatum={setDatum}
              />
              {hasTooltip && (
                <ObsTooltip
                  width={width}
                  height={height}
                  xAnchor={xAnchorTooltip}
                  yAnchor={yAnchorTooltip}
                  dx={dxTooltip}
                  dy={dyTooltip}
                  xAccessor={xTooltip}
                  yAccessor={yTooltip}
                  renderTooltip={renderTooltip}
                  chart={chart}
                  datum={datum}
                />
              )}
            </div>
          </Fade>
        </Box>
      </Box>
    </div>
  );
}

export default ObsPlot;
