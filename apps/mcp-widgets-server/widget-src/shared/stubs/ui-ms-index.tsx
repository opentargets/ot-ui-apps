import React from "react";

// Pass-through hooks from actual provider sources so contexts are shared with Viewer.tsx
export {
  useViewerInteractionState,
  useViewerInteractionDispatch,
} from "@ot/ui/providers/ViewerInteractionProvider";

// ---- Stubs ----

export function Link({ children, to }: { children: React.ReactNode; to: string }) {
  return (
    <a href={to} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export function DataDownloader() {
  return null;
}
export function ObsPlot() {
  return null;
}
export function ObsChart() {
  return null;
}
export function Tooltip({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
export function OtAsyncTooltip({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// Sequence track — not needed in the standalone widget
export function ViewerTrack() {
  return null;
}
