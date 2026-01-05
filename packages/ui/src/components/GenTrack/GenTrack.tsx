import { Box } from "@mui/material";
import { Stage, Container } from '@pixi/react';
import { useMeasure } from "@uidotdev/usehooks";
import { useRef, useMemo, useEffect } from "react";
import { createViewModel } from "./createViewModel";
import ZoomWindow from "./ZoomWindow";
import NestedXInfo from "./NestedXInfo";
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
  InnerXInfo,
  innerTracks,
  _isInner = false,
  _viewModel = null,  // only used if inner genTrack - it is the view model from the outer genTrack
  _innerTracksContainerRef
}) {

  const { xMin, xMax } = useGenTrackState();

  // links zoom window to inner genTrack avoiding React
  const _vm = useMemo(createViewModel, []);
  const viewModel = _isInner || !innerTracks ? null : _vm;

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
  const canvasHeight = yTrackStarts.at(-1) + tracks.at(-1).height;

  // widths
  const [widthRef, { width: totalWidth }] = useMeasure();
  const canvasWidth = totalWidth - yInfoWidth - yInfoGap;

  // zoom window view
  const innerTracksContainerRef = useRef(null);
  useEffect(() => {
    if (!viewModel) return;
    const unsubscribe = viewModel.subscribe(({ start, end }) => {
      const c = innerTracksContainerRef.current;
      if (!c) return;
      c.scale.x = canvasWidth / (end - start);
      c.x = -start * canvasWidth / (end - start);
    });
    viewModel?.setView(xMin + 50, xMax - 150);  // !!!!! PUT BACK TO xMin, xMax !!!!!
    return unsubscribe;
  }, [viewModel, canvasWidth, xMin, xMax]);
  
  return (
    <Box
      ref={widthRef}
      sx={{ diplay: "flex", flexDirection: "column", pt: _isInner ? px(innerGap) : 0 }}
    >
      
      {/* xInfo */}
      {_isInner && XInfo &&
        <Box sx={{ pb: px(xInfoGap), ml: px(yInfoWidth + yInfoGap)}}>
          <NestedXInfo viewModel={_viewModel} XInfo={XInfo} canvasWidth={canvasWidth} />
        </Box>
      }
      {!_isInner && XInfo && (
        <Box sx={{ pb: px(xInfoGap), ml: px(yInfoWidth + yInfoGap)}}>
          <XInfo start={xMin} end={xMax} />
        </Box>
      )}

      {/* container for yInfos and Pixi canvas */}
      <Box sx={{ display: "flex", columnGap: px(yInfoGap) }}>

        {/* yInfos */}
        <Box sx={{
          width: px(yInfoWidth), 
          height: px(canvasHeight),
          flex: "0 0 auto",
          display: "flex",
          flexDirection: "column",
          gap: px(yInfoGap)
        }}>
          {tracks.map(({ id, height, YInfo, yMin, yMax }) => (
            <Box key={id} sx={{ width: px(yInfoWidth), height: px(height) }}>
              <YInfo start={yMin} end={yMax} />
            </Box>
          ))}
        </Box>

        {/* Pixi canvas */}
        <Stage
          width={canvasWidth}
          height={canvasHeight}
          options={{ background: 0xffffff }}
           onMount={(app) => {
            app.stage.eventMode = "static";
            app.stage.hitArea = app.screen;
          }}
        >
          <Container ref={_isInner ? _innerTracksContainerRef : null}>
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
          {viewModel && (
            <ZoomWindow
              viewModel={viewModel}
              canvasWidthPx={canvasWidth}
              canvasHeightPx={canvasHeight}
              xMin={xMin}
              xMax={xMax}
            />
          )}
        </Stage>
      </Box>

      { innerTracks && (
        <GenTrack
          tracks={innerTracks}
          xInfoGap={xInfoGap}
          yInfoGap={yInfoGap}
          trackGap={trackGap}
          XInfo={InnerXInfo}
          yInfoWidth={yInfoWidth}
          innerGap={innerGap}
          _isInner={true}
          _viewModel={viewModel}
          _innerTracksContainerRef={innerTracksContainerRef}
        />
      )}

    </Box>
  );
}

export default GenTrack;