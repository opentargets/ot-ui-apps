import React from "react";

// ---- Viewer providers and hooks (real — context must be shared across all components) ----
export {
  ViewerProvider,
  useViewerState,
  useViewerDispatch,
} from "@ot/ui/providers/ViewerProvider";
export {
  ViewerInteractionProvider,
  useViewerInteractionState,
  useViewerInteractionDispatch,
} from "@ot/ui/providers/ViewerInteractionProvider";

// ---- Real viewer components (direct path imports) ----
export { default as Viewer } from "@ot/ui/components/Viewer/Viewer";
export { default as CompactAlphaFoldLegend } from "@ot/ui/components/CompactAlphaFoldLegend";
export { default as CompactAlphaFoldPathogenicityLegend } from "@ot/ui/components/CompactAlphaFoldPathogenicityLegend";
export { default as CompactAlphaFoldDomainLegend } from "@ot/ui/components/CompactAlphaFoldDomainLegend";
export { default as CompactAlphaFoldHydrophobicityLegend } from "@ot/ui/components/CompactAlphaFoldHydrophobicityLegend";

// ---- Shared widget stubs (reused from the main ui stub) ----
export { SectionItem, DisplayVariantId, usePlatformApi } from "./ui-index";

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
