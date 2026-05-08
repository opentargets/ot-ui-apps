import { useRef } from 'react';
import { Sprite, useTick, useApp } from '@pixi/react';
import { Sprite as PixiSprite, Graphics as PixiGraphics, Application as PixiApplication, Texture } from 'pixi.js';
import type { RefObject } from 'react';
import type { ScalesRef } from './ScalesContext';

const _rectTextureCache = new WeakMap<PixiApplication, Texture>();

function getOrCreateRectTexture(app: PixiApplication): Texture {
  if (!_rectTextureCache.has(app)) {
    const g = new PixiGraphics();
    g.beginFill(0xffffff);
    g.drawRect(0, 0, 1, 1);
    g.endFill();
    _rectTextureCache.set(app, app.renderer.generateTexture(g));
    g.destroy(true);
  }
  return _rectTextureCache.get(app)!;
}

interface DataSpriteProps {
  scalesRef: RefObject<ScalesRef>;
  x: number;
  y?: number;
  width?: number;
  height?: number;
  minPixelWidth?: number;
  minPixelHeight?: number;
  snapWidth?: boolean;
  snapHeight?: boolean;
  trackId?: string;
  texture?: any;
  tint?: number;
  alpha?: number;
  anchor?: [number, number];
  eventMode?: 'static' | 'dynamic' | 'none';
  pointerover?: (e: any) => void;
  pointerout?: (e: any) => void;
  pointerdown?: (e: any) => void;
}

export function DataSprite({
  scalesRef,
  x: dataX,
  y: dataY = 0,
  width: dataWidth,
  height: dataHeight,
  minPixelWidth = 0,
  minPixelHeight = 0,
  snapWidth = false,
  snapHeight = false,
  trackId,
  texture,
  ...spriteProps
}: DataSpriteProps) {
  const app = useApp();
  const resolvedTexture = texture ?? getOrCreateRectTexture(app);
  const spriteRef = useRef<PixiSprite | null>(null);

  // Update position imperatively every tick — reads latest scalesRef without React re-render
  useTick(() => {
    const sprite = spriteRef.current;
    const scales = scalesRef.current;
    if (!sprite || !scales) return;

    const screenX = dataX * scales.xScale + scales.xOffset;
    const yScaleInfo = trackId ? scales.yScales.get(trackId) : undefined;
    const screenY = yScaleInfo
      ? dataY * yScaleInfo.yScale + yScaleInfo.yOffset
      : dataY;

    let screenWidth = dataWidth !== undefined ? dataWidth * scales.xScale : sprite.texture.width;
    let screenHeight = dataHeight !== undefined
      ? dataHeight * (yScaleInfo?.yScale ?? 1)
      : sprite.texture.height;

    if (minPixelWidth > 0) screenWidth = Math.max(screenWidth, minPixelWidth);
    if (minPixelHeight > 0) screenHeight = Math.max(screenHeight, minPixelHeight);

    const finalW = snapWidth ? Math.max(1, Math.round(screenWidth)) : screenWidth;
    const finalH = snapHeight ? Math.max(1, Math.round(screenHeight)) : screenHeight;

    sprite.visible = screenX + finalW > 0 && screenX < scales.canvasWidth;
    sprite.x = screenX;
    sprite.y = screenY;
    sprite.width = finalW;
    sprite.height = finalH;
  });

  return (
    <Sprite
      ref={spriteRef}
      texture={resolvedTexture}
      {...spriteProps}
    />
  );
}
