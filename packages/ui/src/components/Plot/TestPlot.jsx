import { VisProvider } from "./contexts/VisContext";
import Plot from "./components/Plot"
import Panel from "./components/Panel";
import XAxis from "./components/XAxis";
import YAxis from "./components/YAxis";
import Frame from "./components/Frame";
import XTick from "./components/XTick";
import YTick from "./components/YTick";
import XLabel from "./components/XLabel";
import * as d3 from "d3";
import YLabel from "./components/YLabel";
import XTitle from "./components/XTitle";
import XGrid from "./components/XGrid";
import YGrid from "./components/YGrid";
import Circle from "./components/marks/Circle";

const data = [[0, 0], [25, 50], [50, 100]];

export default function TestPlot() {
  return (
    // <VisProvider>
      <Plot
        background="#f4f4f4"
        width="400"
        height="320"
        padding={{ top: 30, right: 20, bottom: 80, left: 40  }}
        data={data}
        scales={{
          x: d3.scaleLinear().domain([0, 50]),
          y: d3.scaleLinear().domain([0, 100]),
        }}
        xTick={[6, 12, 21]}
      >
        <XTick />
        <XTick values={[12.5, 37.5]} stroke="lime" tickLength={10} strokeWidth={3} />
        {/* <XLabel values={ticks => ticks.map(t => t - 2)}/> */}
        <XLabel />
        <XGrid />
        <YTick />
        <YLabel />
        <YGrid />
        <YGrid />
        <Circle x={40} y={d => d[1]} />
      </Plot>
    // </VisProvider>
  );
}