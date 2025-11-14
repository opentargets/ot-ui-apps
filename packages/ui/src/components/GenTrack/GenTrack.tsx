import { Box } from "@mui/material";
import { Stage, Container, Sprite, Text } from '@pixi/react';
// import { useGenTrackState, useGenTrackDispatch } from  "ui"
// import { useGenTracInnerState, useGenTrackInnerDispatch } from "ui";

function GenTrack({ 
  children,
  XInfo,
  gap = 10,
  yInfoWidth = 160,
}) {
  
  return (
    <Box sx={{ diplay: "flex" }}>
      {XInfo && <XInfo />}
      <Stage width={800} height={600} options={{ background: 0x1099bb }}>
      <Container x={200} y={200}>
        <Text
          text="Hello World"
          anchor={0.5}
          x={220}
          y={150}
          filters={[blurFilter]}
          style={
            new TextStyle({
              align: 'center',
              fill: '0xffffff',
              fontSize: 50,
              letterSpacing: 20,
              dropShadow: true,
              dropShadowColor: '#E72264',
              dropShadowDistance: 6,
            })
          }
        />
      </Container>
    </Stage>
    </Box>
  );
}

export default GenTrack;