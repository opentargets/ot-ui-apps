import { useRef, useEffect } from "react";
import { useMeasure } from "@uidotdev/usehooks";
import { PlotProvider, usePlot, usePlotDispatch } from "../contexts/PlotContext";

export default function Plot({ children, responsive, ...options }) {
  return (
    <PlotProvider options={options}>
      {responsive
        ? <ResponsivePlot>{children}</ResponsivePlot>
        : <SVG>{children}</SVG>
      } 
    </PlotProvider>
  );
}

function ResponsivePlot({ children }) {
  const plotDispatch = usePlotDispatch();
  const [ref, { width }] = useMeasure();

  useEffect(() => {
    plotDispatch({ type: 'updateSize', width })
  }, [width]);

  const plot = usePlot();
  const { minWidth, maxWidth } = plot;

  const divStyle = {};
  if (minWidth != null) divStyle.minWidth = `${minWidth}px`;
  if (maxWidth != null) divStyle.maxWidth = `${maxWidth}px`;

  return (
    <div ref={ref} style={divStyle} >
      <SVG>
        {children}
      </SVG>
    </div>
  );
}

function SVG({ children }) {
  const plot = usePlot();  
  const { width, height, background, cornerRadius } = plot;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        cursor: 'default',
        'MozUserSelect': 'none',
        'WebkitUserDelect': 'none',
        'MsUserSelect': 'none',
        'userSelect': 'none',
      }}
    > {(background !== 'transparent' || cornerRadius > 0) &&
        <rect
          width={width}
          height={height}
          fill={background}
          rx={cornerRadius}
        />
      }
      {children}
    </svg>
  );
}