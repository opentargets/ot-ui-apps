import { Box } from "@mui/material";
import { Stage, Container, useApp } from '@pixi/react';
import { useMeasure } from "@uidotdev/usehooks";
import { useRef, useMemo, useEffect, memo } from "react";
import { createViewModel } from "./createViewModel";
import PanZoomPanel from "./PanZoomPanel";
import NestedXInfo from "./NestedXInfo";
import { useGenTrackState } from "../../providers/GenTrackProvider";
import GenTrackTooltip from "./GenTrackTooltip";
import { useGenTrackTooltipDispatch } from "../../providers/GenTrackTooltipProvider";

function px(num) {
  return `${num}px`;
}

const TooltipLayer = memo(function TooltipLayer({ children, width, height, canvasType, tooltipProps }) {
  const genTrackTooltipDispatch = useGenTrackTooltipDispatch();
  
  const handleMouseEnter = () => {
    genTrackTooltipDispatch({ type: "setActiveCanvas", value: canvasType });
  };
  
  const handleMouseLeave = () => {
    genTrackTooltipDispatch({ type: "setActiveCanvas", value: null });
  };
  
  if (!children) return null;
  
  return (
    <Box 
      sx={{ 
        position: "absolute", 
        inset: 0, 
        pointerEvents: "auto",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <GenTrackTooltip width={width} height={height} canvasType={canvasType} {...tooltipProps}>
        {children}
      </GenTrackTooltip>
    </Box>
  );
});

function Tracks({ tracks, canvasWidth, xMin, xMax, yTrackStarts, _isInner }) {
  const app = useApp();
  const trackContainersRef = useRef([]);  // ref to the wrapper container for each track

  // per-frame, per track updates
  useEffect(() => {
    const update = () => {
      if (!trackContainersRef.current.some(v => v)) return;
      for (const [index, { onTick }] of tracks.entries()) {
        onTick?.(trackContainersRef.current[index]);
      }
    };
    app.ticker.add(update);
    return () => app.ticker.remove(update);
  }, []);

  return (
    <>
      {tracks.map(({ id, height = 50, Track, yMin, yMax }, index) => (
        <Container
          key={id}
          ref={el => (trackContainersRef.current[index] = el)}
          width={px(canvasWidth)}
          height={px(height)}
          y={-yMin * (height / (yMax - yMin)) + yTrackStarts[index]}
          x={_isInner ? 0 : -xMin * (canvasWidth / (xMax - xMin))}  // x-shift is on tracks container if inner
          scale={{ 
            x: _isInner ? 1 : canvasWidth / (xMax - xMin),  // x-scale is on tracks container if inner
            y: height / (yMax - yMin),
          }}
        >
          <Track />
        </Container>
      ))}
    </>
  );
}

function GenTrack({
  tracks,
  XInfo,
  XYInfo,
  xyInfoHeight = 32,
  Tooltip,
  tooltipProps = {},
  innerTracks,
  InnerXInfo,
  InnerXYInfo,
  innerXYInfoHeight = 32,
  InnerTooltip,
  innerTooltipProps = {},
  yInfoWidth = 160,
  yInfoGap = 16,
  panZoomTopGap = 16,
  panZoomBottomGap = 16,
  initialZoom = [null, null],
  zoomLines, 
  _isInner = false,
  _viewModel = null,  // only used if inner genTrack - it is the view model from the outer genTrack
  _innerTracksContainerRef
}) {

  const ZOOM_LINE_WIDTH = 2;

  const { data, xMin, xMax } = useGenTrackState();

  const viewModel = useMemo(() => {
    return _isInner || !(innerTracks?.length > 0)
      ? null
      : createViewModel(initialZoom[0] ?? xMin, initialZoom[1] ?? xMax);
  }, [_isInner, innerTracks?.length]);

  // heights
  const yTrackStarts = [];
  let canvasHeight = 0;
  if (tracks?.length > 0) {
    for (const [index, track] of tracks.entries()) {
      yTrackStarts.push(index === 0
        ? (track.paddingTop ?? 0)
        : yTrackStarts.at(-1) + tracks.at(index - 1).height + (track.paddingTop ?? 0)
      );
    }
    canvasHeight = yTrackStarts.at(-1) + tracks.at(-1).height;
  }

  // widths
  const [widthRef, { width: totalWidth }] = useMeasure();
  const canvasWidth = totalWidth - yInfoWidth - yInfoGap;

  // refs
  const innerTracksContainerRef = useRef(null);
  const zoomLinesRef = useRef(null);

  useEffect(() => {
    if (!viewModel || canvasWidth <= 0) return;

    const apply = ({ start, end }) => {
      const c = innerTracksContainerRef.current;
      if (c) {
        c.scale.x = canvasWidth / (end - start);
        c.x = -start * canvasWidth / (end - start);
      }

      const z = zoomLinesRef.current;
      const left = (start - xMin) / (xMax - xMin) * canvasWidth;
      const right = canvasWidth - ((end - xMin) / (xMax - xMin) * canvasWidth);
      if (z) {
        z.style.left = `${left - ZOOM_LINE_WIDTH}px`;
        z.style.right = `${right - ZOOM_LINE_WIDTH}px`;
        z.style.borderLeftStyle = left === 0 ? "none" : "solid"; 
        z.style.borderRightStyle = right === 0 ? "none" : "solid";
      }
    };

    // apply immediately using current view
    apply(viewModel);

    const unsubscribe = viewModel.subscribe(apply);
    return unsubscribe;
  }, [viewModel, canvasWidth, xMin, xMax]);


  return (
    <Box
      ref={widthRef}
      sx={{ display: "flex", flexDirection: "column" }}
    >
      
      {/* XInfo - only render when canvasWidth valid since e.g. D3 axis complains if not */}
      {canvasWidth > 0 && (XInfo || XYInfo) && (
        <Box sx={{ display: "flex", columnGap: px(yInfoGap) }}>
          <Box sx={{ height: px(xyInfoHeight), width: px(yInfoWidth) }}>
            {XYInfo && <XYInfo data={data} />}
          </Box>
          <Box sx={{ height: px(xyInfoHeight), width: px(canvasWidth) }}>
            {XInfo && (_isInner 
              ? <NestedXInfo data={data} viewModel={_viewModel} XInfo={XInfo} canvasWidth={canvasWidth} />
              : <XInfo data={data} start={xMin} end={xMax} canvasWidth={canvasWidth} />
            )}
          </Box>
        </Box>
      )}

      {/* container for yInfos and Pixi canvas */}
      {tracks?.length > 0 && (
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
                <YInfo data={data} start={yMin} end={yMax} />
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
                <Tracks
                  tracks={tracks}
                  canvasWidth={canvasWidth}
                  xMin={xMin}
                  xMax={xMax}
                  yTrackStarts={yTrackStarts}
                  _isInner={_isInner}
                />
              </Container>
            </Stage>
            {Tooltip && (
              <TooltipLayer
                width={canvasWidth}
                height={canvasHeight}
                canvasType={_isInner ? "inner" : "outer"}
                tooltipProps={tooltipProps}
              >
                <Tooltip />   
              </TooltipLayer>
            )}
            
            {/* zoom lines overlay */}
            {zoomLines && innerTracks?.length > 0 && (
              <Box
                ref={zoomLinesRef}
                sx={{
                  position: "absolute",
                  top: tracks[0].paddingTop,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  zIndex: 5,
                  borderTop: 0,
                  borderBottom: 0,
                  borderLeft: `${ZOOM_LINE_WIDTH}px`,
                  borderRight: `${ZOOM_LINE_WIDTH}px`,
                  borderStyle: "solid",
                  borderColor: "#00aaff",
                  pointerEvents: "none",
                }}
              />
            )}
          </Box>
        </Box>
      )}

      {/* inner tracks */}
      {innerTracks?.length > 0 && (
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
              XYInfo={InnerXYInfo}
              xyInfoHeight={innerXYInfoHeight}
              yInfoWidth={yInfoWidth}
              panZoomBottomGap={panZoomBottomGap}
              Tooltip={InnerTooltip}
              tooltipProps={innerTooltipProps}
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