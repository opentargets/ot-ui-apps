import { Box, Typography } from "@mui/material";
import { useViewerState, useViewerDispatch } from "../../providers/ViewerProvider";

// !! ADD TYPES !!

// currently for alphaFold only - assumes single/first structure and contiguous
// residue indices from 1 to structure length
export default function ViewerTrack({ color, viewer }) {

  const viewerState = useViewerState();
  const viewerDispatch = useViewerDispatch();


  // !!! NEED TO ISOLATE PARTS WHICH USE VIEWER STATE VALUE TO AVOID DISPATCH-USE_VALUE LOOP:
  //   - CAN ISOLATE THE CONTENT SHOWN ON HOVER/CLICK INTO OWN COMPONENT
  //   - POSSIBLY JUST PASS ACTUAL COLORS TO THE TRACK SO IS UPDATED FORM OUTSIDE WHEN STATE CHANGES


  
  if (typeof color === "function") {
    color = color(viewer, viewerState);  // SHOULD PASS VIEWER STATE AS LAST ARG!!!!!
  }

  const width = color?.length;
  const trackHeight = 7;
  const topSpace = 6;  // CURRENTLY SET TO ALIGN WITH TEXT, DO PROPERLY!!
  const botttomSpace = 8;
  const totalHeight = trackHeight + topSpace + botttomSpace;

  let hoveredResi;
  if (viewerState.hoveredResi) hoveredResi = viewerState.hoveredResi;
  else if (viewerState.hoveredAtom) hoveredResi = viewerState.hoveredAtom.resi;

	return (
    <Box sx={{ display: "flex", alignItems: "start", gap: 0.75 }}>
      
      <Box sx={{ flex: 1 }}>
        <svg
          viewBox={`0 0 ${width} ${totalHeight}`}
          preserveAspectRatio="none"
          style={{
            width: "100%",
            height: `${totalHeight}px`,
          }}
        >

          {/* residues rectangles */}
          {color
            ? (color.map((col, resiMinusOne) => (
              <rect
                key={resiMinusOne}
                onMouseEnter={() => viewerDispatch({ type: "_setHoveredResi", value: resiMinusOne + 1 })}
                onMouseLeave={() => viewerDispatch({ type: "_setHoveredResi", value: null })}
                onClick={() => viewerDispatch({ type: "_setClickedResi", value: resiMinusOne + 1 })}
                fill={col}
                x={resiMinusOne}
                y={topSpace}
                width={1}
                height={trackHeight}
              />
            ))) : (
              <rect x={0} y={topSpace} width={width} height={trackHeight} fill="#f0f0f0" />
            )
          }
                    
            {/* hover circle */}
            {/* {hoveredResi &&
              <circle cx={hoveredResi - 0.5} cy={0} r={10} fill="lime" />
            } */}

            {/* !! TODO: CLICK BEHAVIOR  */}

          </svg>
        </Box>

        {color &&
          <Typography
            variant="caption"  
            sx={{ flex: 0 }}
          >
            {color.length}
          </Typography>
        }

    </Box>
  );
}
