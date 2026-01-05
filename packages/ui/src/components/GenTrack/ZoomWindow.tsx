import { Container, Graphics } from '@pixi/react';
import { Rectangle } from "pixi.js";
import { useEffect, useRef } from 'react';

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function ZoomWindow({
  viewModel,
  canvasWidthPx,
  canvasHeightPx,
  xMin,
  xMax,
}) {
  const containerRef = useRef();
  const windowGfx = useRef();
  const leftHandle = useRef();
  const rightHandle = useRef();

  const dragState = useRef(null);
    
  const HANDLE_WIDTH_PX = 8;
  const MIN_WINDOW_WIDTH_DATA = 20 * (xMax - xMin) / canvasWidthPx;

  const handleColor = 0x00aaff;

  // redraw window when view changes
  useEffect(() => {
    if (!viewModel) return;
    const unsubscribe = viewModel.subscribe(draw);
    draw({ start: viewModel.start, end: viewModel.end });
    return unsubscribe;
  }, [viewModel, canvasWidthPx, canvasHeightPx, xMin, xMax]);

  const draw = ({ start, end }) => {
    const x = (start - xMin) / (xMax - xMin) * canvasWidthPx; 
    const w = (end - start) / (xMax - xMin) * canvasWidthPx;

    windowGfx.current.clear();
    windowGfx.current.beginFill(handleColor, 0.15);
    windowGfx.current.lineStyle(2, handleColor, 0.9);
    windowGfx.current.drawRect(x, 0, w, canvasHeightPx);
    windowGfx.current.endFill();

    // handles
    leftHandle.current.clear();
    leftHandle.current.beginFill(handleColor);
    leftHandle.current.drawRect(x - HANDLE_WIDTH_PX / 2, 0, HANDLE_WIDTH_PX, canvasHeightPx);
    leftHandle.current.endFill();

    rightHandle.current.clear();
    rightHandle.current.beginFill(handleColor);
    rightHandle.current.drawRect(
      x + w - HANDLE_WIDTH_PX / 2,
      0,
      HANDLE_WIDTH_PX,
      canvasHeightPx
    );
    rightHandle.current.endFill();
  };

  function xPxToData(xPx) {
    return xMin + (xPx / canvasWidthPx) * (xMax - xMin);
  }

  const onDown = (type, e) => {
    dragState.current = {
      type,
      startX: xPxToData(e.data.global.x),
      start: viewModel.start,
      end: viewModel.end,
    };
  };

  const onMove = e => {
    if (!dragState.current) return;

    const { type, startX, start, end } = dragState.current;
    const dx = xPxToData(e.data.global.x) - startX;

    let nextStart = start;
    let nextEnd = end;

    if (type === 'move') {
      const span = end - start;
      nextStart = clamp(start + dx, xMin, xMax - span);
      nextEnd = nextStart + span;
    }

    if (type === 'left') {
      nextStart = clamp(start + dx, xMin, xMax - MIN_WINDOW_WIDTH_DATA);
    }

    if (type === 'right') {
      nextEnd = clamp(end + dx, xMin + MIN_WINDOW_WIDTH_DATA, xMax);
    }

    viewModel.setView(nextStart, nextEnd);
  };

  const onUp = () => {
    dragState.current = null;
  };

  return (
    <Container
      ref={containerRef}
      eventMode="static"
      hitArea={new Rectangle(0, 0, canvasWidthPx, canvasHeightPx)}
      pointermove={onMove}
      pointerup={onUp}
      pointerupoutside={onUp}
    >

      {/* main window */}
      <Graphics
        ref={windowGfx}
        eventMode="static"
        cursor="move"
        pointerdown={e => onDown('move', e)}
      />

      {/* left handle */}
      <Graphics
        ref={leftHandle}
        eventMode="static"
        cursor="ew-resize"
        pointerdown={e => onDown('left', e)}
      />

      {/* right handle */}
      <Graphics
        ref={rightHandle}
        eventMode="static"
        cursor="ew-resize"
        pointerdown={e => onDown('right', e)}
      />
    </Container>
  );
}

export default ZoomWindow;