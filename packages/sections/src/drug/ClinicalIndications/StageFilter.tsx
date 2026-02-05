import { Box, Typography } from "@mui/material";
import { Fragment } from "react/jsx-runtime";
import { clinicalStageCategories } from "@ot/constants";


// const stageToIndex = {};
// for (const [index, stage] of clinicalStageCategories.entries()) {
//   stageToIndex[stage] = index;
// }

const circleWidth = 32;
const lineWidth = 1;
const strokeColor = "#888";
const labelSize = 13;

function StageFilter({ records, selectedStage, setSelectedStage }) {

  return (
    <Box sx={{ display: "flex", alignItems: "end", mt: 2, mr: 6 }}>
      {Object.entries(clinicalStageCategories).map(([stage, { index, label }]) => (
        <Fragment key={label}>
          {index > 0 && (
            <Box
              sx={{ 
                height: `${lineWidth}px`,
                bgcolor: strokeColor,
                minWidth: "10px",
                flex: "1 1 auto",
                mb: `${circleWidth / 2 - lineWidth / 2}px`,
              }}
            />
          )}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0,
              alignItems: "center",
              flex: `0 0 ${circleWidth}px`,
              opacity: index > selectedStage.index ? 0.5 : 1
            }}
          >
            <Box sx={{ height: "50px", width: `${circleWidth}px`, }}>
              <Box
                sx={{
                  position: "relative", /* anchor for absolute child */
                  height: "50px",
                  width: `${circleWidth}px`
                }}  
              >
                <Typography
                  variant="caption"
                  component="span"
                  sx={{
                      position: "absolute",
                      bottom: 0,
                      left: `${(circleWidth + labelSize) / 2 }px`,
                      transform: "rotate(-45deg)",
                      transformOrigin: "bottom left",
                      whiteSpace: "nowrap",
                      fontWeight: stage === selectedStage.stage ? 700 : 400,
                      // fontSize: 12.5,  
                    }}
                  >
                  {label}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                borderRadius: `${circleWidth / 2}px`,
                border: `${stage === selectedStage.stage ? 2 : 1}px solid ${strokeColor}`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: `${circleWidth}px`,
                height: `${circleWidth}px`, 
              }}
            >
              {records[stage]?.length && (
                <Typography variant="caption" sx={{ fontWeight: stage === selectedStage.stage ? 700 : 400 }}>
                  {records[stage].length}
                </Typography>
              )}
            </Box>
          </Box>
        </Fragment>
      ))}
    </Box>
  )
}

export default StageFilter;