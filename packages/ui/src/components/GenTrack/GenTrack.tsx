import { Box } from "@mui/material";
import { Stage, Container, useApp } from '@pixi/react';
import { useMeasure } from "@uidotdev/usehooks";
import { useRef, useEffect, memo, useCallback, useState } from "react";
import PanZoomPanel from "./PanZoomPanel";
import NestedXInfo from "./NestedXInfo";
import { useGenTrackState } from "../../providers/GenTrackProvider";
import GenTrackTooltip from "./GenTrackTooltip";
import { useGenTrackTooltipDispatch } from "../../providers/GenTrackTooltipProvider";
import { ScalesProvider, type ScalesRef } from "./ScalesContext";
import { TrackRegistryProvider, type TrackTransform } from "./TrackRegistry";

function px(num) {
  return `${num}px`;
}

interface TooltipLayerProps {
  children: React.ReactNode;
  width: number;
  height: number;
  canvasType: string;
  tooltipProps: object;
}

const TooltipLayer = memo(function TooltipLayer({ children, width, height, canvasType, tooltipProps }: TooltipLayerProps) {
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

interface TrackProps {
  isInner: boolean;
  trackId: string;
  scalesRef: React.RefObject<ScalesRef>;
}

interface Track {
  id: string;
  height?: number;
  yMin?: number;
  yMax?: number;
  Track: React.ComponentType<TrackProps>;
  YInfo?: React.ComponentType<{ data: any; start: number; end: number; isInner: boolean }>;
  onTick?: (container: any) => void;
  paddingTop?: number;
}

interface TracksProps {
  tracks: Track[];
  canvasWidth: number;
  xMin: number;
  xMax: number;
  yTrackStarts: number[];
  isInner: boolean;
  scalesRef: React.RefObject<ScalesRef>;
  tickerUpdateRef: React.MutableRefObject<(() => void) | null>;
  onReady?: () => void;
  canvasBoxRef?: React.RefObject<HTMLDivElement | null>;
}

function Tracks({ 
  tracks, 
  canvasWidth, 
  xMin, 
  xMax, 
  yTrackStarts, 
  isInner,
  scalesRef,
  tickerUpdateRef,
  onReady,
  canvasBoxRef,
}: TracksProps) {
  const app = useApp();

  // Store ticker.update on both the dedicated ref and scalesRef so updateViewWindow can reach it
  tickerUpdateRef.current = () => app.ticker.update();
  if (scalesRef.current) scalesRef.current.tickerUpdate = () => app.ticker.update();
  const trackContainersRef = useRef([]);

  // Stop continuous ticking and recompute scales — runs whenever canvas geometry changes
  useEffect(() => {
    app.ticker.stop();
    // Hide canvas immediately to avoid flash of stale sprites during resize
    if (canvasBoxRef?.current) canvasBoxRef.current.style.visibility = "hidden";
    // Recompute xScale/xOffset synchronously so they're fresh before the deferred tick
    const s = scalesRef.current;
    if (s) {
      const domainMin = isInner && s.viewStart !== undefined ? s.viewStart : xMin;
      const domainMax = isInner && s.viewEnd !== undefined ? s.viewEnd : xMax;
      s.xScale = canvasWidth / (domainMax - domainMin);
      s.xOffset = -domainMin * s.xScale;
    }
    // Defer tick so all child DataSprite/DataRect refs are attached first
    const id = setTimeout(() => {
      app.ticker.update();
      // Reveal canvas imperatively — no React re-render, no flash
      if (canvasBoxRef?.current) canvasBoxRef.current.style.visibility = "visible";
      onReady?.();
    }, 0);
    return () => clearTimeout(id);
  }, [app, scalesRef, xMin, xMax, canvasWidth, isInner, onReady, canvasBoxRef]);

  // Register track transforms whenever tracks or scales change
  useEffect(() => {
    tracks.forEach((track: Track, index: number) => {
      const { id, height = 50, yMin = 0, yMax = 100 } = track;
      const yScale = height / (yMax - yMin);
      // yOffset is track-local only: maps dataY to pixels within the Container
      // (Container itself is already positioned at yTrackStarts[index])
      const yOffset = -yMin * yScale;
      
      // Update scales ref with y-scale info
      if (scalesRef.current) {
        scalesRef.current.yScales.set(id, {
          yScale,
          yOffset,
          yMin,
          yMax,
          height,
        });
      }
      
      // Register transform for cross-track features
      const transform: TrackTransform = {
        dataToScreen: ({ x, y }) => {
          const scales = scalesRef.current;
          if (!scales) return { screenX: 0, screenY: 0 };
          
          const xScale = scales.xScale;
          const xOffset = scales.xOffset;
          const yScaleInfo = scales.yScales.get(id);
          
          return {
            screenX: x * xScale + xOffset,
            screenY: yScaleInfo ? y * yScaleInfo.yScale + yScaleInfo.yOffset : y,
          };
        },
        screenToData: ({ x, y }) => {
          const scales = scalesRef.current;
          if (!scales) return { dataX: 0, dataY: 0 };
          
          const xScale = scales.xScale;
          const xOffset = scales.xOffset;
          const yScaleInfo = scales.yScales.get(id);
          
          return {
            dataX: (x - xOffset) / xScale,
            dataY: yScaleInfo ? (y - yScaleInfo.yOffset) / yScaleInfo.yScale : y,
          };
        },
      };
      
      scalesRef.current?.trackRegistry.set(id, transform);
    });
    
    return () => {
      tracks.forEach(({ id }: { id: string }) => {
        scalesRef.current?.trackRegistry.delete(id);
      });
    };
  }, [tracks, yTrackStarts, scalesRef]);

  // per-frame, per track updates (optional culling)
  useEffect(() => {
    const update = () => {
      if (!trackContainersRef.current.some(v => v)) return;
      for (const [index, { onTick }] of tracks.entries()) {
        onTick?.(trackContainersRef.current[index]);
      }
    };
    app.ticker.add(update);
    return () => { app.ticker.remove(update); };
  }, [tracks, app.ticker]);

  // Keep static props in scalesRef for DataSprite/useTick to read
  if (scalesRef.current) {
    scalesRef.current.xMin = xMin;
    scalesRef.current.xMax = xMax;
    scalesRef.current.canvasWidth = canvasWidth;
  }

  // On each pan/zoom tick, recompute xScale/xOffset from current viewStart/viewEnd
  // isInner is captured in closure — NOT stored on scalesRef (both Tracks share same ref)
  useEffect(() => {
    const updateScales = () => {
      const s = scalesRef.current;
      if (!s) return;
      const domainMin = isInner && s.viewStart !== undefined ? s.viewStart : xMin;
      const domainMax = isInner && s.viewEnd !== undefined ? s.viewEnd : xMax;
      s.xScale = canvasWidth / (domainMax - domainMin);
      s.xOffset = -domainMin * s.xScale;
    };
    app.ticker.add(updateScales);
    return () => { app.ticker.remove(updateScales); };
  }, [app, scalesRef, xMin, xMax, canvasWidth, isInner]);

  return (
    <>
      {tracks.map(({ id, height = 50, Track, yMin = 0, yMax = 100 }: Track, index: number) => {
        const yScale = height / (yMax - yMin);
        // Container is positioned at yTrackStarts[index]; DataSprite uses local track coords
        const containerY = yTrackStarts[index];
        
        return (
          <Container
            key={id}
            ref={el => (trackContainersRef.current[index] = el)}
            width={px(canvasWidth)}
            height={px(height)}
            y={containerY}
            x={0}
            scale={{ x: 1, y: 1 }}
          >
            <Track isInner={isInner} trackId={id} scalesRef={scalesRef}/>
          </Container>
        );
      })}
    </>
  );
}

interface GenTrackInnerProps {
  tracks: Track[];
  XInfo?: React.ComponentType<any>;
  XYInfo?: React.ComponentType<any>;
  xyInfoHeight?: number;
  Tooltip?: React.ComponentType;
  tooltipProps?: object;
  innerTracks?: Track[];
  InnerXInfo?: React.ComponentType<any>;
  InnerXYInfo?: React.ComponentType<any>;
  innerXYInfoHeight?: number;
  InnerTooltip?: React.ComponentType;
  innerTooltipProps?: object;
  yInfoWidth?: number;
  yInfoGap?: number;
  paddingBottom?: number;
  panZoomTopGap?: number;
  panZoomBottomGap?: number;
  initialZoom?: [number | null, number | null];
  zoomLines?: boolean;
  _isInner?: boolean;
  _scalesRef?: React.RefObject<ScalesRef> | null;
  _innerTracksContainerRef?: React.RefObject<any>;
  _onScalesRefReady?: (ref: React.RefObject<ScalesRef>) => void;
}

function GenTrackInner({
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
  paddingBottom = 16,
  panZoomTopGap = 16,
  panZoomBottomGap = 16,
  initialZoom = [null, null],
  zoomLines, 
  _isInner = false,
  _scalesRef: parentScalesRef = null,
  _innerTracksContainerRef,
  _onScalesRefReady,
}: GenTrackInnerProps) {

  const ZOOM_LINE_WIDTH = 2;

  const { data, xMin, xMax } = useGenTrackState();

  // Ref to ticker.update function — set by Tracks component which lives inside <Stage>
  const tickerUpdateRef = useRef<(() => void) | null>(null);

  // Each GenTrackInner always has its own scalesRef so outer/inner Stages never share xScale/xOffset
  const localScalesRef = useRef<ScalesRef>({
    xScale: 1,
    xOffset: 0,
    xMin,
    xMax,
    // Inner tracks inherit viewStart/viewEnd from parent; outer use initialZoom
    viewStart: _isInner && parentScalesRef?.current?.viewStart !== undefined
      ? parentScalesRef.current.viewStart
      : (initialZoom[0] ?? xMin),
    viewEnd: _isInner && parentScalesRef?.current?.viewEnd !== undefined
      ? parentScalesRef.current.viewEnd
      : (initialZoom[1] ?? xMax),
    yScales: new Map(),
    canvasWidth: 0,
    canvasHeight: 0,
    trackRegistry: new Map(),
  });

  const scalesRef = localScalesRef;

  // Notify parent of our scalesRef so it can push viewStart/viewEnd updates to us
  useEffect(() => {
    _onScalesRefReady?.(scalesRef);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // heights
  const yTrackStarts = [];
  let canvasHeight = 0;
  if (tracks?.length > 0) {
    for (const [index, track] of tracks.entries()) {
      yTrackStarts.push(index === 0
        ? (track.paddingTop ?? 0)
        : yTrackStarts[yTrackStarts.length - 1] + tracks[index - 1].height + (track.paddingTop ?? 0)
      );
    }
    canvasHeight = yTrackStarts[yTrackStarts.length - 1] + tracks[tracks.length - 1].height + paddingBottom;
  }

  // widths — debounced so rapid resize doesn't thrash Pixi Stage recreation
  const [widthRef, { width: totalWidth }] = useMeasure();
  const [debouncedTotalWidth, setDebouncedTotalWidth] = useState(totalWidth);
  useEffect(() => {
    const id = setTimeout(() => setDebouncedTotalWidth(totalWidth), 50);
    return () => clearTimeout(id);
  }, [totalWidth]);
  const canvasWidth = (debouncedTotalWidth ?? 0) - yInfoWidth - yInfoGap;
  
  // Update scales ref when canvas size changes
  useEffect(() => {
    if (scalesRef.current) {
      scalesRef.current.canvasWidth = canvasWidth;
      scalesRef.current.canvasHeight = canvasHeight;
    }
  }, [canvasWidth, canvasHeight, scalesRef]);

  // refs
  const innerTracksContainerRef = useRef(null);
  const zoomLinesRef = useRef<HTMLElement | null>(null);
  // Holds a reference to the inner GenTrackInner's own scalesRef so we can push viewStart/viewEnd to it
  const innerScalesRefHolder = useRef<ScalesRef | null>(null);
  // Hide canvas until first tick fires to avoid flash of black/default-positioned sprites
  const canvasBoxRef = useRef<HTMLDivElement | null>(null);
  const onTracksReady = useCallback(() => {/* canvas revealed imperatively via canvasBoxRef */}, []);

  // Helper to imperatively update zoom line DOM positions
  const updateZoomLines = useCallback((start: number, end: number, width: number) => {
    const z = zoomLinesRef.current;
    if (!z || width <= 0) return;
    const left = (start - xMin) / (xMax - xMin) * width;
    const right = width - ((end - xMin) / (xMax - xMin) * width);
    z.style.left = `${left - ZOOM_LINE_WIDTH}px`;
    z.style.right = `${right - ZOOM_LINE_WIDTH}px`;
    z.style.borderLeftStyle = left <= 0 ? "none" : "solid";
    z.style.borderRightStyle = right <= 0 ? "none" : "solid";
  }, [xMin, xMax]);

  // Resync zoom lines whenever canvasWidth changes
  useEffect(() => {
    const inner = innerScalesRefHolder.current;
    if (inner && canvasWidth > 0) {
      updateZoomLines(inner.viewStart ?? xMin, inner.viewEnd ?? xMax, canvasWidth);
    }
  }, [canvasWidth, xMin, xMax, updateZoomLines]);

  // Callback to update view window (used by PanZoomPanel) — no React state, purely imperative
  const updateViewWindow = useCallback((start: number, end: number) => {
    // Push to inner scalesRef (the zoomed canvas)
    const inner = innerScalesRefHolder.current;
    if (inner) {
      inner.viewStart = start;
      inner.viewEnd = end;
      inner.tickerUpdate?.();
    }
    updateZoomLines(start, end, canvasWidth);
  }, [canvasWidth, updateZoomLines]);


  return (
    <ScalesProvider scalesRef={scalesRef}>
      <TrackRegistryProvider>
        <Box
          ref={widthRef}
          sx={{ display: "flex", flexDirection: "column" }}
        >
          
          {/* XInfo - only render when canvasWidth valid since e.g. D3 axis complains if not */}
          {canvasWidth > 0 && (XInfo || XYInfo) && (
            <Box sx={{ display: "flex", columnGap: px(yInfoGap) }}>
              <Box sx={{ height: px(xyInfoHeight), width: px(yInfoWidth) }}>
                {XYInfo && <XYInfo data={data} isInner={_isInner} />}
              </Box>
              <Box sx={{ height: px(xyInfoHeight), width: px(canvasWidth) }}>
                {XInfo && (_isInner 
                  ? <NestedXInfo
                      data={data}
                      scalesRef={scalesRef}
                      isInner={_isInner}
                      XInfo={XInfo}
                      canvasWidth={canvasWidth}
                    />
                  : <XInfo
                      data={data}
                      start={xMin}
                      end={xMax}
                      isInner={_isInner}
                      canvasWidth={canvasWidth}
                    />
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
                {tracks.map(({ id, height, paddingTop, YInfo, yMin = 0, yMax = 100 }) => (
                  <Box key={id} sx={{ width: px(yInfoWidth), height: px(height), mt: px(paddingTop) }}>
                    {YInfo && <YInfo data={data} start={yMin} end={yMax} isInner={_isInner}/>}
                  </Box>
                ))}
              </Box>

              {/* Pixi canvas — hidden until first tick positions all sprites */}
              <Box ref={canvasBoxRef} sx={{ width: canvasWidth, height: canvasHeight, position: "relative", visibility: "hidden" }}>
                <Stage
                  width={canvasWidth}
                  height={canvasHeight}
                  options={{ background: 0xffffff, autoStart: false, antialias: true }}
                >
                  <Container ref={_isInner ? _innerTracksContainerRef : null}>
                    <Tracks
                      tracks={tracks}
                      canvasWidth={canvasWidth}
                      xMin={xMin}
                      xMax={xMax}
                      yTrackStarts={yTrackStarts}
                      isInner={_isInner}
                      scalesRef={scalesRef}
                      tickerUpdateRef={tickerUpdateRef}
                      onReady={onTracksReady}
                      canvasBoxRef={canvasBoxRef}
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
                {zoomLines && innerTracks && innerTracks.length > 0 && (
                  <Box
                    ref={zoomLinesRef}
                    sx={{
                      position: "absolute",
                      top: 0,
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
          {innerTracks && innerTracks.length > 0 && (
            <>   
              <Box sx={{
                pt: px(panZoomTopGap),
                pb: px(panZoomBottomGap),
                pl: px(yInfoWidth + yInfoGap),
              }}>
                <PanZoomPanel
                  viewStart={scalesRef.current?.viewStart ?? xMin}
                  viewEnd={scalesRef.current?.viewEnd ?? xMax}
                  onViewChange={updateViewWindow}
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
                <GenTrackInner
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
                  _scalesRef={scalesRef}
                  _innerTracksContainerRef={innerTracksContainerRef}
                  _onScalesRefReady={(ref) => { innerScalesRefHolder.current = ref.current; }}
                />
              </Box>
            </>
          )}

        </Box>
      </TrackRegistryProvider>
    </ScalesProvider>
  );
}

// Wrapper component that provides the outermost providers
function GenTrack(props: Omit<GenTrackInnerProps, '_scalesRef' | '_isInner' | '_innerTracksContainerRef'>) {
  const localScalesRef = useRef<ScalesRef>({
    xScale: 1,
    xOffset: 0,
    xMin: 0,
    xMax: 100,
    yScales: new Map(),
    trackRegistry: new Map(),
    canvasWidth: 0,
    canvasHeight: 0,
  });

  return (
    <ScalesProvider scalesRef={localScalesRef}>
      <TrackRegistryProvider>
        <GenTrackInner {...props} _scalesRef={localScalesRef} />
      </TrackRegistryProvider>
    </ScalesProvider>
  );
}

export default GenTrack;