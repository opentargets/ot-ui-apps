import { useRef, useEffect } from "react";
import { useMeasure } from "@uidotdev/usehooks";
import { PlotProvider, usePlot, usePlotDispatch } from "../contexts/PlotContext";
import { useVisClearSelection } from "../contexts/VisContext";

export default function Plot({
      children,
      responsive,
      clearOnClick,
      clearOnLeave,
      ...options
    }) {
  
  return (
    <PlotProvider options={options}>
      {responsive
        ? <ResponsivePlot {...{clearOnClick, clearOnLeave}}>
            {children}
          </ResponsivePlot>
        : <SVG {...{clearOnClick, clearOnLeave}}>
            {children}
          </SVG>
      } 
    </PlotProvider>
  );
}

function ResponsivePlot({ children, clearOnClick, clearOnLeave }) {
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
      <SVG {...{clearOnClick, clearOnLeave}}>
        {children}
      </SVG>
    </div>
  );
}

function SVG({ children, clearOnClick, clearOnLeave }) {

  const visClearSelection = useVisClearSelection();

  const plot = usePlot();  
  const { width, height, background, cornerRadius } = plot;

  const attrs = {
    viewBox: `0 0 ${width} ${height}`,
    xmlns: "http://www.w3.org/2000/svg",
    style: {
      width: `${width}px`,
      height: `${height}px`,
      cursor: 'default',
      'MozUserSelect': 'none',
      'WebkitUserDelect': 'none',
      'MsUserSelect': 'none',
      'userSelect': 'none',
    },
  };
  if (clearOnClick) {
    if (!visClearSelection) {
      throw Error("clearOnClick prop can only be used inside a Vis component");
    }
    attrs.onClick = visClearSelection;
  }
  if (clearOnLeave) {
    if (!visClearSelection) {
      throw Error("clearOnLeave prop can only be used inside a Vis component");
    }
    attrs.onMouseLeave = visClearSelection;
  }

  return (
    <svg {...attrs}>
      {(background !== 'transparent' || cornerRadius > 0) &&
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