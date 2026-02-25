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

// Real ObsPlot / ObsChart / ObsTooltip — needed for waterfall charts in cell
// popovers and detail modals. Imported directly (bypass barrel).
export { default as ObsPlot } from "@ot/ui/components/ObsPlot/ObsPlot";
export { default as ObsChart } from "@ot/ui/components/ObsPlot/ObsChart";
export { default as ObsTooltip } from "@ot/ui/components/ObsPlot/ObsTooltip";

/** Tooltip: renders children only (no help icon / tooltip popup) */
export function Tooltip({ children }: { children?: ReactNode; [key: string]: unknown }) {
  return <>{children}</>;
}

/** OtAsyncTooltip: renders children only */
export function OtAsyncTooltip({ children }: { children?: ReactNode; [key: string]: unknown }) {
  return <>{children}</>;
}

/** TooltipTable: renders a table container for tooltip content */
export function TooltipTable({ children }: { children?: ReactNode }) {
  return (
    <table style={{ borderSpacing: "0 0.4rem", width: "100%" }}>
      <tbody>{children}</tbody>
    </table>
  );
}

/** TooltipRow: renders a labeled row for tooltip content */
export function TooltipRow({
  label,
  children,
}: {
  label?: string;
  children?: ReactNode;
  valueWidth?: number;
  truncateValue?: boolean;
}) {
  return (
    <tr>
      {label !== undefined && (
        <td
          style={{
            fontSize: 13,
            fontWeight: 600,
            paddingRight: 8,
            verticalAlign: "top",
            whiteSpace: "nowrap",
            color: "#718096",
          }}
        >
          {label}:
        </td>
      )}
      <td>{children}</td>
    </tr>
  );
}

/** ScientificNotation: renders a number in scientific notation */
export function ScientificNotation({
  number,
  dp = 2,
}: {
  number?: number | [number, number];
  dp?: number;
  [key: string]: unknown;
}) {
  if (number == null) return null;
  if (Array.isArray(number)) {
    const [mantissa, exponent] = number;
    return (
      <span>
        {mantissa.toFixed(dp)} × 10<sup>{exponent}</sup>
      </span>
    );
  }
  if (number === 0) return <span>0</span>;
  const exp = Math.floor(Math.log10(Math.abs(number)));
  const mant = (number / Math.pow(10, exp)).toFixed(dp);
  return (
    <span>
      {mant} × 10<sup>{exp}</sup>
    </span>
  );
}

/** DisplayVariantId: shows a short variant ID label */
export function DisplayVariantId({
  variantId,
  referenceAllele,
  alternateAllele,
  maxChars = 6,
}: {
  variantId?: string;
  referenceAllele?: string;
  alternateAllele?: string;
  expand?: boolean;
  maxChars?: number;
}) {
  if (!variantId) return null;
  const ref = referenceAllele && referenceAllele.length > maxChars ? "DEL" : referenceAllele;
  const alt = alternateAllele && alternateAllele.length > maxChars ? "INS" : alternateAllele;
  const display = ref && alt ? `${ref}/${alt}` : variantId;
  return <span>{display}</span>;
}

/** Navigate: renders a "View →" link to an OT platform page */
export function Navigate({ to }: { to?: string }) {
  const href = !to ? "#" : to.startsWith("/") ? `https://platform.opentargets.org${to}` : to;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        textDecoration: "none",
        color: "inherit",
      }}
    >
      View →
    </a>
  );
}

/** ClinvarStars: renders a star rating (★ filled, ☆ empty) */
export function ClinvarStars({ num = 0, length = 4 }: { num?: number; length?: number }) {
  const stars = Array.from({ length }, (_, i) => (i < num ? "★" : "☆")).join("");
  return <span style={{ color: "#FFC107", letterSpacing: 1 }}>{stars}</span>;
}

/** L2GScoreIndicator: renders the L2G score as tabular text */
export function L2GScoreIndicator({
  score,
}: {
  score?: number;
  studyLocusId?: string;
  targetId?: string;
}) {
  if (score == null) return null;
  return <span style={{ fontVariantNumeric: "tabular-nums" }}>{score.toFixed(3)}</span>;
}

/**
 * SectionItem: strip the section chrome — just call renderBody() directly.
 * Section chrome (title, description, download button, error/loading states)
 * is handled by the widget shell; here we only need the body content.
 */
export function SectionItem({
  renderBody,
  request,
}: {
  renderBody?: () => React.ReactNode;
  request?: { loading?: boolean; error?: unknown };
  [key: string]: unknown;
}) {
  if (request?.loading) {
    return (
      <div style={{ padding: "24px", color: "#718096", fontFamily: "sans-serif" }}>
        Loading…
      </div>
    );
  }
  if (request?.error) {
    return (
      <div style={{ padding: "24px", color: "#e53e3e", fontFamily: "sans-serif" }}>
        Error loading data.
      </div>
    );
  }
  return <>{renderBody?.()}</>;
}

/** OtTable: real component from @ot/ui (direct path, bypassing barrel) */
export { default as OtTable } from "@ot/ui/components/OtTable/OtTable";

/** useBatchQuery: real hook from @ot/ui (direct path, bypassing barrel) */
export { default as useBatchQuery } from "@ot/ui/hooks/useBatchQuery";

/** usePlatformApi: returns null — fragments are not needed inside the widget */
export function usePlatformApi() {
  return null;
}

/** PublicationsDrawer: renders a simple link to the first publication entry */
export function PublicationsDrawer({
  entries,
  customLabel,
}: {
  entries?: { name?: string; url?: string }[];
  customLabel?: string;
  [key: string]: unknown;
}) {
  const first = entries?.[0];
  if (!first?.url) return null;
  return (
    <a href={first.url} target="_blank" rel="noreferrer">
      {customLabel ?? first.name ?? first.url}
    </a>
  );
}
