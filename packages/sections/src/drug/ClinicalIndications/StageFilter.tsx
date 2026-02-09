import { Box, Typography } from "@mui/material";
import { clinicalStageCategories } from "@ot/constants";

const usedCircleWidth = 30;
const emptyCircleWidth = 17;
const lineWidth = 1;
const strokeColor = "#888";  // !! ARBITRATY COLOR !!
const labelSize = 13;

function StageFilter({ records, selectedStage, setSelectedStage, maxStage }) {
  const entries = Object.entries(clinicalStageCategories);
  const totalStages = entries.length;

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "end",
        mt: 2,
        mr: 6,
      }}
    >

      {/* single absolute line behind all circles */}
      <Box
        sx={{
          position: "absolute",
          bottom: `${usedCircleWidth / 2 - lineWidth / 2}px`,
          left: 0,
          right: 0,
          height: `${lineWidth}px`,
          // !! ARBITRARY COLORS !!
          background: `linear-gradient(
            to right,
            ${strokeColor} 0%,
            ${strokeColor} ${(maxStage.index / (totalStages - 1)) * 100}%,
            rgba(136,136,136,0.25) ${(maxStage.index / (totalStages - 1)) * 100}%,
            rgba(136,136,136,0.25) 100%
          )`,
          zIndex: 0,
        }}
      />

      {/* evenly spaced stage columns */}
      {entries.map(([stage, { index, label }]) => {
        const hasRecords = records[stage]?.length > 0;
        const circleWidth = hasRecords ? usedCircleWidth : emptyCircleWidth;

        return (
          <Box
            key={stage}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flex: "0 0 auto",
              zIndex: 1,
            }}
          >
            <Box sx={{ height: "50px", position: "relative", width: `${circleWidth}px` }}>
              <Typography
                variant="caption"
                component="span"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: `${(circleWidth + labelSize) / 2}px`,
                  transform: "rotate(-45deg)",
                  transformOrigin: "bottom left",
                  whiteSpace: "nowrap",
                  fontWeight: stage === selectedStage.stage ? 700 : 400,
                  opacity: index > maxStage.index ? 0.4 : 1,
                }}
              >
                {label}
              </Typography>
            </Box>
            <Box
              component={hasRecords ? "button" : "div"}
              sx={{
                borderRadius: `${circleWidth / 2}px`,
                borderStyle: "solid",
                borderWidth: `${stage === selectedStage.stage ? 2 : 1}px`,
                borderColor: `${index > maxStage.index ? "rgba(136,136,136,0.3)" : hasRecords ? "primary.main" : strokeColor }`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: `${circleWidth}px`,
                height: `${circleWidth}px`,
                cursor: hasRecords && stage !== selectedStage.stage ? "pointer" : "auto",  
                my: hasRecords ? 0 : `${(usedCircleWidth - emptyCircleWidth) / 2}px`,
                color: stage === selectedStage.stage ? "#fff" : "primary.main",
                // !! USING ARBITRARY LIGHT BLUE BELOW - DO WE HAVE APPROPRIATE THEME (OR AT LEAST MUI) COLOR
                bgcolor: stage === selectedStage.stage ? "primary.main" : hasRecords ? "#ecf7ff" : "background.paper",
                "&:hover": {
                  // !! USING ARBITRARY LIGHT BLUE BELOW - DO WE HAVE APPROPRIATE THEME (OR AT LEAST MUI) COLOR
                  bgcolor: stage === selectedStage.stage ? "primary.main" : hasRecords ? "#e1eff9" : "background.paper",

                },
              }}
              onClick={hasRecords ? () => setSelectedStage({ index, stage }) : undefined}
            >
              {hasRecords && (
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: hasRecords ? 700 : 400, opacity: index > maxStage.index ? 0.3 : 1,
                    fontSize: 11.5,
                  }}
                >
                  {records[stage].length}
                </Typography>
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  )
}

export default StageFilter;