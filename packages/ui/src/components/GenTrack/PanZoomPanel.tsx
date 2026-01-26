import { useCallback, useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function PanZoomPanel({ viewModel, canvasWidth, xMin, xMax }) {
  const [windowBounds, setWindowBounds] = useState({ x: 0, width: canvasWidth });
  const dragState = useRef(null);
  const containerRef = useRef(null);
  const windowRef = useRef(null);
  const leftHandleRef = useRef(null);
  const rightHandleRef = useRef(null);
  const currentTransformXRef = useRef(0);
  const currentWidthRef = useRef(canvasWidth);
  const pendingViewRef = useRef(null);
  const rafRef = useRef(null);

  const HANDLE_WIDTH = 8;
  const PANEL_HEIGHT = 20;
  const MIN_WINDOW_WIDTH_DATA = 20 * (xMax - xMin) / canvasWidth;
  const HANDLE_COLOR = '#00aaff';

  // sync react state on external viewModel changes
  useEffect(() => {
    if (!viewModel) return;

    const updateBounds = ({ start, end }) => {
      const x = (start - xMin) / (xMax - xMin) * canvasWidth;
      const width = (end - start) / (xMax - xMin) * canvasWidth;

      setWindowBounds({ x, width });
      currentTransformXRef.current = x;
      currentWidthRef.current = width;

      // update window
      if (windowRef.current) {
        windowRef.current.style.width = `${width}px`;
        windowRef.current.style.transform = `translateX(${x}px)`;
      }

      // update handles fully outside
      if (leftHandleRef.current) leftHandleRef.current.style.left = `${x - HANDLE_WIDTH}px`;
      if (rightHandleRef.current) rightHandleRef.current.style.left = `${x + width}px`;
    };

    const unsubscribe = viewModel.subscribe(updateBounds);
    updateBounds({ start: viewModel.start, end: viewModel.end });
    return unsubscribe;
  }, [viewModel, canvasWidth, xMin, xMax]);

  const handleMouseDown = useCallback((type, e) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = containerRef.current.getBoundingClientRect();

    dragState.current = {
      type,
      rectLeft: rect.left,
      startClientX: e.clientX,
      startTransformX: currentTransformXRef.current,
      startWidth: currentWidthRef.current,
      start: viewModel.start,
      end: viewModel.end,
    };
  }, [viewModel]);

  // schedule a batched viewModel update via RAF
  const scheduleViewModelUpdate = useCallback((start, end) => {
    pendingViewRef.current = { start, end };
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        if (pendingViewRef.current) {
          viewModel.setView(pendingViewRef.current.start, pendingViewRef.current.end);
          pendingViewRef.current = null;
        }
        rafRef.current = null;
      });
    }
  }, [viewModel]);

  const handleMouseMove = useCallback((e) => {
    const state = dragState.current;
    if (!state) return;

    const { type, startClientX, startTransformX, startWidth, start, end } = state;
    const dxPx = e.clientX - startClientX;

    let newStart = start;
    let newEnd = end;
    let newX = startTransformX;
    let newWidth = startWidth;

    if (type === 'move') {
      const span = end - start;
      const dxData = dxPx / canvasWidth * (xMax - xMin);
      newStart = clamp(start + dxData, xMin, xMax - span);
      newEnd = newStart + span;
      newX = (newStart - xMin) / (xMax - xMin) * canvasWidth;
    } else if (type === 'left') {
      const dxData = dxPx / canvasWidth * (xMax - xMin);
      newStart = clamp(start + dxData, xMin, end - MIN_WINDOW_WIDTH_DATA);
      newEnd = end;
      newX = (newStart - xMin) / (xMax - xMin) * canvasWidth;
      newWidth = (newEnd - newStart) / (xMax - xMin) * canvasWidth;
    } else if (type === 'right') {
      const dxData = dxPx / canvasWidth * (xMax - xMin);
      newEnd = clamp(end + dxData, start + MIN_WINDOW_WIDTH_DATA, xMax);
      newStart = start;
      newX = (newStart - xMin) / (xMax - xMin) * canvasWidth;
      newWidth = (newEnd - newStart) / (xMax - xMin) * canvasWidth;
    }

    // imperative visual updates
    if (windowRef.current) {
      windowRef.current.style.transform = `translateX(${newX}px)`;
      windowRef.current.style.width = `${newWidth}px`;
    }
    if (leftHandleRef.current) leftHandleRef.current.style.left = `${newX - HANDLE_WIDTH}px`; // fully outside
    if (rightHandleRef.current) rightHandleRef.current.style.left = `${newX + newWidth}px`; // fully outside


    currentTransformXRef.current = newX;
    currentWidthRef.current = newWidth;

    // batch Pixi update
    scheduleViewModelUpdate(newStart, newEnd);
  }, [canvasWidth, xMin, xMax, MIN_WINDOW_WIDTH_DATA, scheduleViewModelUpdate]);

  const handleMouseUp = useCallback(() => {
    dragState.current = null;

    // ensure a final viewModel update
    const finalStart = xMin + currentTransformXRef.current / canvasWidth * (xMax - xMin);
    const finalEnd = finalStart + currentWidthRef.current / canvasWidth * (xMax - xMin);
    viewModel.setView(finalStart, finalEnd);
  }, [viewModel, canvasWidth, xMin, xMax]);

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (dragState.current) handleMouseMove(e);
    };
    const handleGlobalMouseUp = () => {
      if (dragState.current) handleMouseUp();
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        width: canvasWidth,
        height: `${PANEL_HEIGHT}px`,
        backgroundColor: '#ddd',
        cursor: dragState.current ? 'grabbing' : 'default',
      }}
    >
      {/* main window */}
      <Box
        ref={windowRef}
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: `${windowBounds.width}px`,
          height: `${PANEL_HEIGHT}px`,
          backgroundColor: `${HANDLE_COLOR}26`,
          borderColor: `${HANDLE_COLOR}e6`,
          borderStyle: "solid",
          borderWidth: "2px 0",
          cursor: 'move',
        }}
        onMouseDown={(e) => handleMouseDown('move', e)}
      />

      {/* left handle */}
      <Box
        ref={leftHandleRef}
        sx={{
          position: 'absolute',
          left: `${windowBounds.x - HANDLE_WIDTH}px`,
          top: 0,
          width: `${HANDLE_WIDTH}px`,
          height: `${PANEL_HEIGHT}px`,
          backgroundColor: HANDLE_COLOR,
          cursor: 'ew-resize',
        }}
        onMouseDown={(e) => handleMouseDown('left', e)}
      />

      {/* right handle */}
      <Box
        ref={rightHandleRef}
        sx={{
          position: 'absolute',
          left: `${windowBounds.x + windowBounds.width}px`,
          top: 0,
          width: `${HANDLE_WIDTH}px`,
          height: `${PANEL_HEIGHT}px`,
          backgroundColor: HANDLE_COLOR,
          cursor: 'ew-resize',
        }}
        onMouseDown={(e) => handleMouseDown('right', e)}
      />
    </Box>
  );
}

export default PanZoomPanel;