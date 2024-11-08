
import { useRef, useEffect } from "react";
import { useMeasure } from "@uidotdev/usehooks";
import { PlotProvider, usePlotDispatch } from "../contexts/PlotContext";
import SVGContainer from "./SVGContainer";

export default function ResponsivePlot({ children, ...options }) {
  return (
    <PlotProvider options={options}>
      <Container>
        {children}
      </Container>
    </PlotProvider> 
  );
}

function Container({ children }) {
  const plotDispatch = usePlotDispatch();
  const [ref, { width }] = useMeasure();

  useEffect(() => {
    plotDispatch({ type: 'updateSize', width })
  }, [width]);

  return (
    <div ref={ref}>
      <SVGContainer>
        {children}
      </SVGContainer>
    </div>
  );
}