import { useRef } from 'react';
import { Graphics, useTick } from '@pixi/react';
import { Graphics as PixiGraphics } from 'pixi.js';
import type { RefObject } from 'react';
import type { ScalesRef } from './ScalesContext';

interface DataRectProps {
  scalesRef: RefObject<ScalesRef>;
  trackId?: string;
  x: number;
  y?: number;
  width: number;
  height: number;
  color?: number;
  alpha?: number;
}

/**
 * A filled rectangle whose position and size are computed imperatively on each
 * ticker update from data-space coordinates, exactly like DataSprite.
 * Required when ticker.stop() is used — Graphics draw callbacks run at React
 * render time and would otherwise use stale xScale/xOffset.
 */
export function DataRect({
  scalesRef,
  trackId,
  x: dataX,
  y: dataY = 0,
  width: dataWidth,
  height: dataHeight,
  color = 0xffffff,
  alpha = 1,
}: DataRectProps) {
  const gRef = useRef<PixiGraphics | null>(null);

  useTick(() => {
    const g = gRef.current;
    const scales = scalesRef.current;
    if (!g || !scales) return;

    const screenX = dataX * scales.xScale + scales.xOffset;
    const screenW = dataWidth * scales.xScale;

    const yScaleInfo = trackId ? scales.yScales.get(trackId) : undefined;
    const screenY = yScaleInfo
      ? dataY * yScaleInfo.yScale + yScaleInfo.yOffset
      : dataY;
    const screenH = dataHeight * (yScaleInfo?.yScale ?? 1);

    // Cull if outside canvas bounds
    if (screenX + screenW < 0 || screenX > scales.canvasWidth) {
      g.clear();
      return;
    }

    g.clear();
    g.beginFill(color, alpha);
    g.drawRect(screenX, screenY, screenW, screenH);
    g.endFill();
  });

  return <Graphics ref={gRef} />;
}

interface DataHLineProps {
  scalesRef: RefObject<ScalesRef>;
  trackId?: string;
  y: number;
  color?: number;
  alpha?: number;
  strokePixels?: number;
}

/**
 * A full-width horizontal line at a given data-space y value.
 * Redraws imperatively on each tick so it stays correct during pan/zoom.
 */
export function DataHLine({
  scalesRef,
  trackId,
  y: dataY,
  color = 0x000000,
  alpha = 1,
  strokePixels = 1,
}: DataHLineProps) {
  const gRef = useRef<PixiGraphics | null>(null);

  useTick(() => {
    const g = gRef.current;
    const scales = scalesRef.current;
    if (!g || !scales) return;

    const yScaleInfo = trackId ? scales.yScales.get(trackId) : undefined;
    const screenY = yScaleInfo
      ? dataY * yScaleInfo.yScale + yScaleInfo.yOffset
      : dataY;

    g.clear();
    g.lineStyle(strokePixels, color, alpha);
    g.moveTo(0, screenY);
    g.lineTo(scales.canvasWidth, screenY);
  });

  return <Graphics ref={gRef} />;
}
