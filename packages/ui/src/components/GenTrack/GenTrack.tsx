import { Box } from "@mui/material";
import { Stage, Container } from '@pixi/react';
import { useMeasure } from "@uidotdev/usehooks";
import { useMemo } from "react";
import { createViewModel } from "./createViewModel";
import ZoomWindow from "./ZoomWindow";
import InnerXInfo from "./InnerXInfo";
import { useGenTrackState } from "../../providers/GenTrackProvider";

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

  const { xMin, xMax } = useGenTrackState();

  // links zoom window to inner genTrack avoiding React
  const viewModel = _isInner ? null : useMemo(createViewModel, []);
  viewModel?.setView(xMin, xMax);
  
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

      const pixelsPerUnit = canvasWidth / (start - end);
      c.scale.x = pixelsPerUnit;
      c.x = -end * pixelsPerUnit;
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
            ? <InnerXInfo viewModel={viewModel} XInfo={XInfo} />
            : <XInfo start={xMin} end={xMax} />
          }
        </Box>
      }

      {/* container for yInfos and Pixi canvas */}
      <Box sx={{ display: "flex", columnGap: px(yInfoGap) }}>

        {/* yInfos */}
        <Box sx={{ width: px(yInfoWidth), height: px(canvasHeight), flex: "0 0 auto" }}>
          {tracks.map({ id, height, YInfo, yMin, yMax } => (
            <Box key={id} sx={{ width: px(yInfoWidth), height: px(height) }}>
              <YInfo start={yMin} end={yMax} />
            </Box>
          )}
        </Box>

        {/* Pixi canvas */}
        <Stage width={canvasWidth} height={canvasHeight} options={{ background: 0xe8e8e8 }}>
          <Container ref={_isInner ? innerRef : null}>
            {tracks.map(({ id, height = 50, Track, yMin, yMax }, index) => (
              <Container
                key={id}
                width={px(canvasWidth)}
                height={px(height)}
                y={-yMin * (height / (yMax - yMin)) + yTrackStarts[index]}
                x={_isInner ? 1 : -xMin * (canvasWidth / (xMax - xMin))}  // x-shift is on tracks container if inner
                scale={{ 
                  x: _isInner ? 1 : canvasWidth / (xMax - xMin),  // x-scale is on tracks container if inner
                  y: height / (yMax - yMin),
                }}
              >
                <Track />
              </Container>
            ))}
          </Container>
          {innerTracks && (
            <ZoomWindow
              viewModel={viewModel}
              widthPx={width}
              heightPx={canvasHeight}
            />
          )}
        </Stage>
      </Box>

      { innerTracks && (
        <GenTrack
          tracks={innerTracks}
          xInfoGap={XInfoGap}
          yInfoGap={yInfoGap}
          trackGap={trackGap}
          XInfo={innerXInfo}
          yInfoWidth={yInfoWidth}
          innerGap={innerGap}
          _isInner={true}
        />
      )}

    </Box>
  );
}

export default GenTrack;