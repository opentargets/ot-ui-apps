import { Box } from "@mui/material";
import { Stage, Container, Text } from '@pixi/react';
import { sum } from 'd3';
import { useMeasure } from "@uidotdev/usehooks";
// import { useGenTrackState, useGenTrackDispatch } from  "ui"
// import { useGenTracInnerState, useGenTrackInnerDispatch } from "ui";

function px(num) {
  return `${num}px`;
}

function GenTrack({ 
  tracks,
  InnerGenTrack,
  xInfoGap = 16,
  yInfoGap = 16,
  trackGap = 16,
  innerGenTrackGap = 16,
  addWindow = false,
  XInfo,
  yInfoWidth = 160,
}) {
  
  // heights
  if (!tracks?.length) throw Error("at least one track expected");
  const canvasHeight = sum(tracks, t => t.height) + trackGap * (tracks.length -1);

  // widths
  const [widthRef, { width: totalWidth }] = useMeasure();
  const canvasWidth = totalWidth - yInfoWidth - yInfoGap;  

  return (
    <Box ref={widthRef} sx={{ diplay: "flex", flexDirection: "column" }}>
      
      {/* xInfo */}
      <Box sx={{ pb: px(xInfoGap) }}>
        {XInfo && <XInfo />}
      </Box>

      {/* container for yInfos and Pixi canvas */}
      <Box sx={{ display: "flex", columnGap: px(yInfoGap) }}>

        {/* yInfos */}
        <Box sx={{ width: px(yInfoWidth), height: px(canvasHeight), flex: "0 0 auto" }}>
          {tracks.map({ id, height, YInfo } => (
            <Box key={id} sx={{ width: px(yInfoWidth), height: px(height) }}>
              <YInfo />
            </Box>
          )}
        </Box>

        {/* Pixi canvas */}
        <Stage width={canvasWidth} height={canvasHeight} options={{ background: 0xe8e8e8 }}>
          {tracks.map(({ id, height, Track }) => (
            <Container key={id} width={px(canvasWidth)} height={px(height) }>
              <Track />
            </Container>
          ))}
        </Stage>

      </Box>

    </Box>
  );
}

export default GenTrack;