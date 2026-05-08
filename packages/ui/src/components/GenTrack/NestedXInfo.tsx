import { useState, useEffect, RefObject } from "react";
import { ScalesRef } from "./ScalesContext";

interface NestedXInfoProps {
  data: any;
  scalesRef: RefObject<ScalesRef>;
  XInfo: React.ComponentType<{ data: any; start: number; end: number; isInner: boolean; canvasWidth: number }>;
  isInner: boolean;
  canvasWidth: number;
}

function NestedXInfo({ data, scalesRef, XInfo, isInner, canvasWidth }: NestedXInfoProps) {
  // Read initial values from ref
  const initialStart = scalesRef.current?.viewStart ?? 0;
  const initialEnd = scalesRef.current?.viewEnd ?? 100;
  
  const [range, setRange] = useState({
    start: initialStart,
    end: initialEnd,
  });

  // Poll the ref for changes (since the ref updates imperatively during pan/zoom)
  useEffect(() => {
    let rafId: number;
    let lastStart = initialStart;
    let lastEnd = initialEnd;
    
    const checkForChanges = () => {
      const scales = scalesRef.current;
      if (scales) {
        const currentStart = scales.viewStart ?? scales.xMin;
        const currentEnd = scales.viewEnd ?? scales.xMax;
        
        if (currentStart !== lastStart || currentEnd !== lastEnd) {
          lastStart = currentStart;
          lastEnd = currentEnd;
          setRange({ start: currentStart, end: currentEnd });
        }
      }
      rafId = requestAnimationFrame(checkForChanges);
    };
    
    rafId = requestAnimationFrame(checkForChanges);
    
    return () => cancelAnimationFrame(rafId);
  }, [scalesRef, initialStart, initialEnd]);

  return <XInfo data={data} start={range.start} end={range.end} isInner={isInner} canvasWidth={canvasWidth} />;
}

export default NestedXInfo;