import { Box } from "@mui/material";
import { Stage, Container, Text } from '@pixi/react';
// import { sum, cumsum } from 'd3';
import { useMeasure } from "@uidotdev/usehooks";
import { useMemo } from "react";
import { createViewModel } from "./createViewModel";
import ZoomWindow from "./ZoomWindow";
import InnerXInfo from "./InnerXInfo";
// import { useGenTrackState, useGenTrackDispatch } from  "ui"
// import { useGenTracInnerState, useGenTrackInnerDispatch } from "ui";

function px(num) {
  return `${num}px`;
}

function GenTrack({ 
  tracks,
  xInfoGap = 16,
  yInfoGap = 16,
  trackGap = 16,
  XInfo,
  yInfoWidth = 160,
  innerGap = 16,
  innerXInfo,
  innerTracks,
  _isInner = false,
}) {

  // links zoom window to inner genTrack avoiding React
  const viewModel = _isInner ? null : useMemo(createViewModel, []);
  
  // heights
  if (!tracks?.length) throw Error("at least one track expected");
  const yTrackStarts = [];
  for (const index of tracks.keys()) {
    if (index === 0) {
      yTrackStarts.push(0);
    } else {
      yTrackStarts.push(yTrackStarts.at(-1) + tracks[index - 1].height + trackGap);
    }
  }
  const canvasHeight = yTrackStarts + tracks.at(-1).height;

  // widths
  const [widthRef, { width: totalWidth }] = useMeasure();
  const canvasWidth = totalWidth - yInfoWidth - yInfoGap;

  // zoom window view
  const innerRef = useRef();
  useEffect(() => {
    return viewModel.subscribe(({ start, end }) => {
      const c = innerRef.current;
      if (!c) return;

      const scale = 1 / (end - start);
      c.scale.x = scale;
      c.x = -start * 100 * scale;
    });
  }, [viewModel]);

  return (
    <Box
      ref={widthRef}
      sx={{ diplay: "flex", flexDirection: "column", pb: _isInner ? px(innerGap) : 0 }}
    >
      
      {/* xInfo */}
      {XInfo &&
        <Box sx={{ pb: px(xInfoGap) }}>
          {_isInner
            ? <InnerXInfo viewModel={viewModel} XInfo={XInfo}>
            : <XInfo start={} end={} />
          }
        </Box>
      }

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
          {tracks.map(({ id, height, Track }, index) => {
            const xScale = canvasWidth / 100;
            const yScale = height / 100;
            return (
              <Container
                key={id}
                width={px(canvasWidth)}
                height={px(height)}
                y={yTrackStarts[index]}
                scale={{ x: xScale, y:yScale }}
              >
                <Track />
              </Container>
            );
          })}
          {innerTracks &&(
            <ZoomWindow
              viewModel={viewModel}
              widthPx={width}
              heightPx={80}
            />
          )}
        </Stage>

      </Box>

      { innerTracks && (
        <GenTrack
          tracks={innerTracks},
          xInfoGap={},
          yInfoGap={yInfoGap},
          trackGap={trackGap},
          XInfo={innerXInfo},
          yInfoWidth={yInfoWidth},
          _isInner={true},
        ></GenTrack>
      )}

    </Box>
  );
}

export default GenTrack;