/*
Compomemt for creating an Observable Plot with optional tooltip.

ADD MORE DETAILS HERE, INC: !!!!!!!!!!!!!!!!
- ADD className: "tooltip-mark" to all tooltip marks
- DO NOT USE REVERSE FOR SCALES IN PLOT SINCE TOOLTIP WILL KNOW - FLIP AXIS
  LIMITS INSTEAD
*/

import { ReactElement, useState } from "react";
import { useMeasure } from "@uidotdev/usehooks";
import { Box, Fade } from "@mui/material";
import { ObsChart, ObsTooltip } from "ui";

// !! REPLACE ANY WHERE CAN
type ObsPlotProps = {
  data: any;
  otherData?: any;
  height: number;
  // xReverse?: boolean;
  // yReverse?: boolean;
  renderChart?: (params: {
    data: any;
    otherData?: any;
    width: number;
    height: number;
  }) => SVGSVGElement;
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
  // xReverse = false,
  // yReverse = false,
  renderChart,
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
              // xReverse={xReverse}
              // yReverse={yReverse}
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
                // xReverse={xReverse}
                // yReverse={yReverse}
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

/* TODO

- allow width options such as min-width, responsive is optional, ...

CHECKS:
- not getting issue of nice changing the yMax (resulting in decimal ticks
  values)? - check properly

INTERACTION:
- highlighted line does not jump in front of circlees - possibly okay
  since most users will hover on circles (not lines) so good to leave all circles
  above lines?
- tooltip is next to circle mark even when hover on line - is this ok?
- if over a new mark and click to remove old sticky tooltip, the new tooltip is
  not shown
  - check clickStick and related logic to fix this and any other corner cases
  - tell user it is click-to-stick?
  - requireing resetElementseems clunky - and needs matched to style in plot.
    - can we use eg classes? - but where put css and plot sets inline styles anyway
      

POLISH APPEARANCE
- fonts: family, sizes, style, weight, alignment, offset  ...
- axis and grid width, color, dashed, ...

CLEAN UP
- add types where appropriate
- reusable components and patterns for common plot stuff - responsive container,
  plot controls, other?
- how com never get searchSuggestion rs7412 on this local branch?!
- put return null if loading in right place
- loading skeleton/msg

*/
