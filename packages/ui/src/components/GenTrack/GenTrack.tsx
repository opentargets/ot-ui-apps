import { Box } from "@mui/material";
import { Rectangle } from "pixi.js";
import { Stage, Container } from '@pixi/react';
import { useMeasure } from "@uidotdev/usehooks";
import { useRef, useMemo, useEffect, memo } from "react";
import { createViewModel } from "./createViewModel";
import PanZoomPanel from "./PanZoomPanel";
import NestedXInfo from "./NestedXInfo";
import { useGenTrackState } from "../../providers/GenTrackProvider";
import VisTooltip from "../VisTooltip";
import { useVisTooltipDispatch } from "../../providers/VisTooltipProvider";

function px(num) {
  return `${num}px`;
}

const TooltipLayer = memo(function TooltipLayer({ render, width, height, canvasType }) {
  const visTooltipDispatch = useVisTooltipDispatch();
  
  const handleMouseEnter = () => {
    visTooltipDispatch({ type: "setActiveCanvas", value: canvasType });
  };
  
  const handleMouseLeave = () => {
    visTooltipDispatch({ type: "setActiveCanvas", value: null });
  };
  
  if (!render) return null;
  
  return (
    <Box 
      sx={{ 
        position: "absolute", 
        inset: 0, 
        pointerEvents: "auto"
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <VisTooltip width={width} height={height} canvasType={canvasType}>
        {render}
      </VisTooltip>
    </Box>
  );
});

function GenTrack({
  tracks,
  XInfo,
  innerTracks,
  InnerXInfo,
  yInfoWidth = 160,
  yInfoGap = 16,
  panZoomTopGap = 16,
  panZoomBottomGap = 16,
  renderTooltip,
  innerRenderTooltip,
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
  for (const [index, track] of tracks.entries()) {
    yTrackStarts.push(index === 0
      ? (track.paddingTop ?? 0)
      : yTrackStarts.at(-1) + tracks.at(index - 1).height + (track.paddingTop ?? 0)
    );
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
      sx={{ diplay: "flex", flexDirection: "column" }}
    >
      
      {/* xInfo */}
      {_isInner && XInfo &&
        <Box sx={{ ml: px(yInfoWidth + yInfoGap)}}>
          <NestedXInfo viewModel={_viewModel} XInfo={XInfo} canvasWidth={canvasWidth} />
        </Box>
      }
      {!_isInner && XInfo && (
        <Box sx={{ ml: px(yInfoWidth + yInfoGap)}}>
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
        }}>
          {tracks.map(({ id, height, paddingTop, YInfo, yMin, yMax }) => (
            <Box key={id} sx={{ width: px(yInfoWidth), height: px(height), mt: px(paddingTop) }}>
              <YInfo start={yMin} end={yMax} />
            </Box>
          ))}
        </Box>

        {/* Pixi canvas */}
        <Box sx={{ width: canvasWidth, height: canvasHeight, position: "relative" }}>
          <Stage
            width={canvasWidth}
            height={canvasHeight}
            options={{ background: 0xffffff }}
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
          </Stage>
          {renderTooltip && (
            <TooltipLayer
              render={renderTooltip}
              width={canvasWidth}
              height={canvasHeight}
              canvasType={_isInner ? "inner" : "outer"}
            />
          )}
        </Box>
      </Box>

      {innerTracks && (
        <>   
          <Box sx={{
            pt: px(panZoomTopGap),
            pb: px(panZoomBottomGap),
            pl: px(yInfoWidth + yInfoGap),
          }}>
            <PanZoomPanel
              viewModel={viewModel}
              canvasWidth={canvasWidth}
              xMin={xMin}
              xMax={xMax}
            />
          </Box>

          <Box 
            sx={{ 
              position: "relative",
              pointerEvents: "none", // Allow clicks to pass through the container
            }}
          >
            <GenTrack
              tracks={innerTracks}
              yInfoGap={yInfoGap}
              XInfo={InnerXInfo}
              yInfoWidth={yInfoWidth}
              panZoomBottomGap={panZoomBottomGap}
              renderTooltip={innerRenderTooltip}
              _isInner={true}
              _viewModel={viewModel}
              _innerTracksContainerRef={innerTracksContainerRef}
            />
          </Box>
        </>
      )}

    </Box>
  );
}

export default GenTrack;