import { Box, Typography } from "@mui/material";
import { clinicalStageCategories } from "@ot/constants";

const usedCircleWidth = 30;
const emptyCircleWidth = 17;
const lineWidth = 1;
const labelSize = 13;

function StageFilter({ records, selectedStage, setSelectedStage, maxStage }) {
  const entries = Object.entries(clinicalStageCategories);
  const totalStages = entries.length;

  if (!maxStage) return null;

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "end",
        mt: 4,
        mr: 10,
      }}
    >
      {/* single absolute line behind all circles – stops at Phase IV */}
      <Box
        sx={{
          position: "absolute",
          bottom: `${usedCircleWidth / 2 - lineWidth / 2}px`,
          left: 0,
          width: records[entries[entries.length - 1][0]]?.length > 0
            ? `calc(${((totalStages - 2) / (totalStages - 1)) * 100}% - ${(usedCircleWidth - emptyCircleWidth) / 2}px)`
            : `${((totalStages - 2) / (totalStages - 1)) * 100}%`,
          height: `${lineWidth}px`,
          background: theme => {
            const pct = Math.min((clinicalStageCategories[maxStage].index / (totalStages - 2)) * 100, 100);
            return `linear-gradient(
              to right,
              ${theme.palette.primary.main} 0%,
              ${theme.palette.primary.main} ${pct}%,
              rgba(136,136,136,0.25) ${pct}%,
              rgba(136,136,136,0.25) 100%
            )`;
          },
          zIndex: 0,
        }}
      />

      {/* evenly spaced stage columns */}
      {entries.map(([stage, { index, label }]) => {
        const hasRecords = records[stage]?.length > 0;
        const circleWidth = hasRecords || index === entries.length -1 ? usedCircleWidth : emptyCircleWidth;

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
                  fontWeight: stage === selectedStage ? 700 : 400,
                  opacity: index > clinicalStageCategories[maxStage].index ? 0.42 : 1,
                }}
              >
                {label}
              </Typography>
            </Box>
            <Box
              component={hasRecords ? "button" : "div"}
              sx={{
                borderRadius: index === entries.length - 1 ? 0 : `${circleWidth / 2}px`,
                boxShadow: theme => (hasRecords && stage !== selectedStage
                  ? theme.boxShadow.md
                  : "none"
                ),
                borderStyle: "solid",
                borderWidth: `${stage === selectedStage ? 2 : 1}px`,
                borderColor: `${index > clinicalStageCategories[maxStage].index ? "rgba(136,136,136,0.3)" : "primary.main"  }`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: `${circleWidth}px`,
                height: `${circleWidth}px`,
                cursor: hasRecords && stage !== selectedStage ? "pointer" : "auto",  
                my: hasRecords ? 0 : `${(usedCircleWidth - emptyCircleWidth) / 2}px`,
                color: stage === selectedStage ? "#fff" : "primary.main",
                // !! USING ARBITRARY LIGHT BLUE BELOW - DO WE HAVE APPROPRIATE THEME (OR AT LEAST MUI) COLOR
                bgcolor: stage === selectedStage ? "primary.main" : hasRecords ? "#ecf7ff" : "background.paper",
                "&:hover": {
                  // !! USING ARBITRARY LIGHT BLUE BELOW - DO WE HAVE APPROPRIATE THEME (OR AT LEAST MUI) COLOR
                  bgcolor: stage === selectedStage ? "primary.main" : hasRecords ? "#e1eff9" : "background.paper",

                },
              }}
              onClick={hasRecords ? () => setSelectedStage(stage) : undefined}
            >
              {hasRecords && (
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: hasRecords ? 700 : 400, opacity: index > clinicalStageCategories[maxStage].index ? 0.3 : 1,
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