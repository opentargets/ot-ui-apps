/**
 * L2G heatmap widget — uses the real HeatmapTable component from packages/ui.
 *
 * MUI theme, CssBaseline, and Emotion CacheProvider are provided by the parent
 * Root component in createWidgetEntry.tsx (created at IIFE module scope).
 *
 * Platform-specific dependencies (Link → React Router, DataDownloader, ObsPlot)
 * are replaced by lightweight stubs at build time via the stubUiBarrel Vite plugin.
 */
import React, { useState, useEffect } from "react";
import HeatmapTable from "@ot/ui/components/HeatmapTable/HeatmapTable";

const OT_API = "https://api.platform.opentargets.org/api/v4/graphql";

const L2G_QUERY = `
  query L2GWidget($studyLocusId: String!) {
    credibleSet(studyLocusId: $studyLocusId) {
      l2GPredictions {
        rows {
          shapBaseValue
          score
          target { id approvedSymbol }
          features { name value shapValue }
        }
      }
    }
  }
`;

type L2GRow = {
  shapBaseValue: number;
  score: number;
  target: { id: string; approvedSymbol: string };
  features: { name: string; value: number; shapValue: number }[];
};

async function fetchL2G(studyLocusId: string): Promise<L2GRow[]> {
  const res = await fetch(OT_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: L2G_QUERY, variables: { studyLocusId } }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return json?.data?.credibleSet?.l2GPredictions?.rows ?? [];
}

type Props = { studyLocusId: string };

export default function L2GWidget({ studyLocusId }: Props) {
  const [rows, setRows] = useState<L2GRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setRows(null);
    setError(null);
    fetchL2G(studyLocusId)
      .then(setRows)
      .catch(err => setError(String(err)));
  }, [studyLocusId]);

  const baseStyle: React.CSSProperties = {
    padding: 24,
    fontFamily: '"Inter", sans-serif',
  };

  if (error) return <div style={{ ...baseStyle, color: "#e53e3e" }}>Error: {error}</div>;
  if (!rows) return <div style={{ ...baseStyle, color: "#718096" }}>Loading L2G predictions…</div>;
  if (!rows.length)
    return (
      <div style={{ ...baseStyle, color: "#718096", fontStyle: "italic" }}>
        No L2G predictions for {studyLocusId}.
      </div>
    );

  return (
    <HeatmapTable
      loading={false}
      data={{ rows }}
      query=""
      variables={{ studyLocusId }}
      disabledExport
    />
  );
}
