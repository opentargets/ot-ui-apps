/**
 * Stubs for platform-specific ui package exports.
 *
 * HeatmapTable (and HeatmapLegend) import from the "ui" barrel index
 * which pulls in React Router, OtAsyncTooltip, and other platform deps
 * that don't make sense in a standalone iframe widget.
 *
 * This stub file replaces those imports at build time (via the stubUiBarrel
 * Vite plugin in vite.widget.config.ts).
 */
import type { ReactNode } from "react";

/** Link: opens OT platform pages in a new tab, or follows external URLs */
export function Link({
  to,
  children,
}: {
  to?: string;
  children?: ReactNode;
  external?: boolean;
  asyncTooltip?: boolean;
  newTab?: boolean;
  footer?: boolean;
  tooltip?: unknown;
  className?: string;
  ariaLabel?: string;
  onClick?: () => void;
}) {
  const href =
    !to ? "#" : to.startsWith("/") ? `https://platform.opentargets.org${to}` : to;
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

/** DataDownloader: disabled in the widget (no export button) */
export function DataDownloader() {
  return null;
}

/** ObsPlot: disabled in the widget (waterfall popovers show empty) */
export function ObsPlot() {
  return null;
}

/** ObsChart: not used by HeatmapTable but re-exported from the ui barrel */
export function ObsChart() {
  return null;
}

/** Tooltip: renders children only (no help icon / tooltip popup) */
export function Tooltip({ children }: { children?: ReactNode; [key: string]: unknown }) {
  return <>{children}</>;
}

/** OtAsyncTooltip: renders children only */
export function OtAsyncTooltip({ children }: { children?: ReactNode; [key: string]: unknown }) {
  return <>{children}</>;
}
