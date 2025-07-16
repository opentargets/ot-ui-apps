import { Box } from "@mui/material";
import { useViewerState, useViewerDispatch } from "../../providers/ViewerProvider";

// !! ADD TYPES !!

// currently for alphaFold only - assumes single/first structure and contiguous
// residue indices from 1 to structure length
export default function ViewerTrack({ color }) {

  const viewerState = useViewerState();
  const viewerDispatch = useViewerDispatch();
  
  if (typeof color === "function") {
    color = color(viewerState);
  }

  const width = color.length;
  const height = 7;

	return (
      <Box sx={{ pb: 0.75 }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          style={{
            width: "100%",
            height: `${height}px`,
          }}
          >
            {color.map((col, resi) => (
              <rect
                key={resi}
                onMouseEnter={() => viewerDispatch({ type: "_setHoveredResi", value: resi })}
                onMouseLeave={() => viewerDispatch({ type: "_setHoveredResi", value: null })}
                onClick={() => viewerDispatch({ type: "_setClickedResi", value: resi })}
                fill={col}
                x={resi}
                y={0}
                width={1}
                height={height}
              />
            ))}
        </svg>
      </Box>
  );
}
