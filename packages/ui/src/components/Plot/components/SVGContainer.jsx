import { usePlot } from "../contexts/PlotContext";

export default function SVGContainer({ children }) {
  const plot = usePlot();
  if (!plot) {
    throw Error("SVGContainer component must appear inside a Plot component");
  }
  
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