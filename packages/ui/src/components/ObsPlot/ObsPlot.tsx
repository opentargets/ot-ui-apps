import { ReactElement, useState } from "react";
import { useMeasure } from "@uidotdev/usehooks";
import { Box, Fade } from "@mui/material";
import { ObsChart, ObsTooltip } from "ui";

type ObsPlotProps = {
  data: any;
  otherData?: any;
  height: number;
  renderChart: (param: {
    data: any;
    otherData?: any;
    width: number;
    height: number;
  }) => SVGSVGElement;
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
  const [ref, { width }] = useMeasure();
  const [chart, setChart] = useState(null);
  const [datum, setDatum] = useState(null);

  const hasTooltip = Boolean(xTooltip && yTooltip && renderTooltip);

  return (
    <div>
      <Box sx={{ position: "relative", width: "100%", margin: "0 auto" }} ref={ref}>
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
    </div>
  );
}

export default ObsPlot;
