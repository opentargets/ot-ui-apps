import { useRef } from "react";

/**
 * Hook to manage DOM tooltips outside of React's control
 * Handles creation, tracking, and safe removal of tooltip elements
 */
export function useTooltips() {
  const tooltipsRef = useRef<Set<HTMLDivElement>>(new Set());

  const addTooltip = (tooltip: HTMLDivElement) => {
    tooltipsRef.current.add(tooltip);
  };

  const removeTooltip = (tooltip: HTMLDivElement) => {
    try {
      if (tooltip.parentNode) {
        console.log("[TOOLTIP] Removing tooltip, parent:", (tooltip.parentNode as Element).tagName);
        tooltip.parentNode.removeChild(tooltip);
      }
    } catch (err) {
      console.error("[TOOLTIP] Failed to remove tooltip:", err);
    }
    tooltipsRef.current.delete(tooltip);
  };

  const clearAllTooltips = () => {
    console.log("[TOOLTIP] Clearing all tooltips, count:", tooltipsRef.current.size);
    let cleanupIndex = 0;
    for (const tooltip of tooltipsRef.current) {
      cleanupIndex++;
      try {
        if (tooltip.parentNode) {
          console.log(`[TOOLTIP_CLEANUP_${cleanupIndex}] Removing tooltip`);
          tooltip.parentNode.removeChild(tooltip);
        }
      } catch (err) {
        console.error(`[TOOLTIP_CLEANUP_${cleanupIndex}] Failed to remove:`, err);
      }
    }
    tooltipsRef.current.clear();
  };

  return {
    tooltipsRef,
    addTooltip,
    removeTooltip,
    clearAllTooltips,
  };
}
