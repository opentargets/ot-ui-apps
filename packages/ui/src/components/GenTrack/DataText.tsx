import { useRef } from 'react';
import { Text, useTick } from '@pixi/react';
import { Text as PixiText, TextStyle } from 'pixi.js';
import type { RefObject } from 'react';
import type { ScalesRef } from './ScalesContext';

interface DataTextProps {
  scalesRef: RefObject<ScalesRef>;
  x: number;
  y?: number;
  text: string;
  trackId?: string;
  style?: TextStyle;
  anchor?: [number, number];
  alpha?: number;
  rotation?: number;
}

export function DataText({ 
  scalesRef,
  x: dataX,
  y: dataY = 0,
  trackId,
  text,
  style,
  anchor,
  alpha = 1,
  rotation = 0,
}: DataTextProps) {
  const textRef = useRef<PixiText | null>(null);

  useTick(() => {
    const t = textRef.current;
    const scales = scalesRef.current;
    if (!t || !scales) return;

    const screenX = dataX * scales.xScale + scales.xOffset;
    const yScaleInfo = trackId ? scales.yScales.get(trackId) : undefined;
    const screenY = yScaleInfo
      ? dataY * yScaleInfo.yScale + yScaleInfo.yOffset
      : dataY;

    // Cull if outside canvas bounds
    t.visible = screenX + t.width > 0 && screenX < scales.canvasWidth;
    t.x = screenX;
    t.y = screenY;
  });

  return (
    <Text
      ref={textRef}
      text={text}
      style={style}
      anchor={anchor}
      alpha={alpha}
      rotation={rotation}
    />
  );
}
