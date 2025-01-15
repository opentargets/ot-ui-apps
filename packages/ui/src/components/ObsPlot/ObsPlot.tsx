import { ReactElement, useState } from "react";
import { useMeasure } from "@uidotdev/usehooks";
import { Box, Fade } from "@mui/material";
import { ObsChart, ObsTooltip } from "ui";

type ObsPlotProps = {
  data: any;
  otherData?: any;
  height: number;
  renderChart?: (params: {
    data: any;
    otherData?: any;
    width: number;
    height: number;
  }) => SVGSVGElement;
  processChart?: (chart: SVGSVGElement) => void;
  xTooltip?: (d: any, i?: number) => number | string;
  yTooltip?: (d: any, i?: number) => number | string;
  xAnchorTooltip?: "left" | "right" | "center" | "adapt";
  yAnchorTooltip?: "top" | "bottom" | "center" | "adapt";
  dxTooltip?: number;
  dyTooltip?: number;
  renderTooltip?: (datum: any) => ReactElement;
  fadeElement?: (elmt: SVGElement) => void;
  highlightElement?: (elmt: SVGElement) => void;
  resetElement?: (elmt: SVGElement) => void;
};

function ObsPlot({
  data, // main data used by plot and tooltip
  otherData, // other data sets used by renderChart
  height,
  renderChart,
  processChart,
  xTooltip, // x accessor function for tooltip
  yTooltip, // y accessor function for tooltip
  xAnchorTooltip = "adapt",
  yAnchorTooltip = "adapt",
  dxTooltip = 0, // +ve value distances tooltip from anchor point - ignored if centered
  dyTooltip = 0,
  renderTooltip,
  fadeElement = () => {}, // passed an SVG element - a non-selected tooltip marks
  highlightElement = () => {}, // passed an SVG element - a selected tooltip mark
  resetElement = () => {}, // passed an SVG element - should undo fade/highlight
}: ObsPlotProps) {
  const [ref, { width }] = useMeasure();
  const [chart, setChart] = useState(null);
  const [datum, setDatum] = useState(null);

  const hasTooltip = xTooltip && yTooltip && renderTooltip;

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
              processChart={processChart}
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
                xAccessor={xTooltip}
                yAccessor={yTooltip}
                dx={dxTooltip}
                dy={dyTooltip}
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
