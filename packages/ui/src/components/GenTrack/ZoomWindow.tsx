import { Container, Graphics } from '@pixi/react';
import { useEffect, useRef } from 'react';

const HANDLE_WIDTH = 8;
const MIN_WINDOW_WIDTH = 2; // in 0-100 scale

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function ZoomWindow({
  viewModel,
  widthPx,
  heightPx,
}) {
  const containerRef = useRef();
  const windowGfx = useRef();
  const leftHandle = useRef();
  const rightHandle = useRef();

  const dragState = useRef(null);

  // redraw window when view changes
  useEffect(() => {
    return viewModel.subscribe(draw);
  }, [viewModel]);

  const draw = ({ start, end }) => {
    const x = start / 100 * widthPx;
    const w = (end - start) / 100 * widthPx;

    windowGfx.current.clear();
    windowGfx.current.beginFill(0x00aaff, 0.25);
    windowGfx.current.lineStyle(2, 0x00aaff, 0.9);
    windowGfx.current.drawRect(x, 0, w, heightPx);
    windowGfx.current.endFill();

    // handles
    leftHandle.current.clear();
    leftHandle.current.beginFill(0x00aaff);
    leftHandle.current.drawRect(x - HANDLE_WIDTH / 2, 0, HANDLE_WIDTH, heightPx);
    leftHandle.current.endFill();

    rightHandle.current.clear();
    rightHandle.current.beginFill(0x00aaff);
    rightHandle.current.drawRect(
      x + w - HANDLE_WIDTH / 2,
      0,
      HANDLE_WIDTH,
      heightPx
    );
    rightHandle.current.endFill();
  };

  // pointer helpers
  const getNormX = e => e.data.global.x / widthPx * 100;

  const onDown = (type, e) => {
    dragState.current = {
      type,
      startX: getNormX(e),
      start: viewModel.start,
      end: viewModel.end,
    };
  };

  const onMove = e => {
    if (!dragState.current) return;

    const { type, startX, start, end } = dragState.current;
    const dx = getNormX(e) - startX;

    let nextStart = start;
    let nextEnd = end;

    if (type === 'move') {
      const span = end - start;
      nextStart = clamp(start + dx, 0, 100 - span);
      nextEnd = nextStart + span;
    }

    if (type === 'left') {
      nextStart = clamp(start + dx, 0, end - MIN_WINDOW_WIDTH);
    }

    if (type === 'right') {
      nextEnd = clamp(end + dx, start + MIN_WINDOW_WIDTH, 1);
    }

    viewModel.set({ start: nextStart, end: nextEnd });
  };

  const onUp = () => {
    dragState.current = null;
  };

  return (
    <Container
      ref={containerRef}
      eventMode="static"
      pointermove={onMove}
      pointerup={onUp}
      pointerupoutside={onUp}
    >
      {/* main window */}
      <Graphics
        ref={windowGfx}
        interactive
        pointerdown={e => onDown('move', e)}
      />

      {/* left handle */}
      <Graphics
        ref={leftHandle}
        interactive
        cursor="ew-resize"
        pointerdown={e => onDown('left', e)}
      />

      {/* right handle */}
      <Graphics
        ref={rightHandle}
        interactive
        cursor="ew-resize"
        pointerdown={e => onDown('right', e)}
      />
    </Container>
  );
}

export default ZoomWindow;