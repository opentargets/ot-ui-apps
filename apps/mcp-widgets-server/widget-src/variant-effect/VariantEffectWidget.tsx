import { useState, useEffect, useRef } from "react";
import * as PlotLib from "@observablehq/plot";
import { rgb } from "d3";
import { useMeasure } from "@uidotdev/usehooks";
import { Box, Fade, Skeleton, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useTheme } from "@mui/material/styles";

const OT_GRAPHQL_API = "https://api.platform.opentargets.org/api/v4/graphql";

const VARIANT_EFFECT_QUERY = `
  query VariantEffectWidget($variantId: String!) {
    variant(variantId: $variantId) {
      id
      variantEffect {
        method
        assessment
        score
        assessmentFlag
        normalisedScore
      }
      referenceAllele
      alternateAllele
    }
  }
`;

const VARIANT_EFFECT_METHODS: Record<string, { prettyName: string; description: string }> = {
  AlphaMissense: {
    prettyName: "AlphaMissense",
    description:
      "Model that builds on AlphaFold2 to assess the effect for missense variants across the proteome.",
  },
  LossOfFunctionCuration: {
    prettyName: "LoF curation",
    description:
      "Curation of loss-of-function variants performed by an Open Targets project team (OTAR2075).",
  },
  FoldX: {
    prettyName: "FoldX",
    description: "Tool that predicts the impact of mutations on protein stability and structure.",
  },
  GERP: {
    prettyName: "GERP",
    description:
      "Scores used to identify regions of the genome that are evolutionarily conserved and likely to be functionally important.",
  },
  LOFTEE: {
    prettyName: "LOFTEE",
    description:
      "Tool used to identify and annotate high-confidence loss-of-function, focusing on variants that likely disrupt gene function.",
  },
  SIFT: {
    prettyName: "SIFT",
    description: "Predicting whether an amino acid substitution affects protein function.",
  },
  VEP: {
    prettyName: "Ensembl VEP",
    description:
      "Pathogenicity score derived from the most severe consequence term provided by Ensembl VEP.",
  },
};

const PRIORITISATION_COLORS = [
  rgb("#bc3a19"),
  rgb("#d65a1f"),
  rgb("#e08145"),
  rgb("#e3a772"),
  rgb("#e6ca9c"),
  rgb("#eceada"),
  rgb("#c5d2c1"),
  rgb("#9ebaa8"),
  rgb("#78a290"),
  rgb("#528b78"),
  rgb("#2f735f"),
];

const colorScale = [...PRIORITISATION_COLORS].reverse();

const getXLabel = (tick: number) => {
  if (tick === -1) return "Likely benign";
  if (tick === 0) return "Uncertain";
  if (tick === 1) return "Likely deleterious";
  return "";
};

const getLicense = (method: string) => {
  if (method === "CADD" || method === "PolyPhen") return "Non-commercial (Deprecated)";
  return undefined;
};

type Row = {
  method: string;
  assessment: string | null;
  score: number | null;
  assessmentFlag: string | null;
  normalisedScore: number | null;
};

// ---- Plot ----

function Plot({ data, width }: { data: Row[]; width: number | null }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!data || width === null || !containerRef.current) return;

    const chart = PlotLib.plot({
      width,
      height: Math.max(200, data.length * 45 + 60),
      label: null,
      marginLeft: 120,
      marginRight: 100,
      x: {
        axis: "bottom",
        ticks: 2,
        labelAnchor: "center",
        tickFormat: (d: number) => getXLabel(d),
        tickSize: 0,
        domain: [-1, 1],
      },
      y: {
        tickSize: 0,
        tickPadding: 18,
        tickFormat: (d: string) => VARIANT_EFFECT_METHODS[d]?.prettyName ?? "Not defined",
        domain: data.map(d => d.method),
      },
      color: {
        legend: false,
        type: "linear",
        range: colorScale,
        domain: [-1, 1],
        interpolate: "hsl",
      },
      style: { fontSize: "15px" },
      marks: [
        PlotLib.text(data, {
          x: -1,
          y: "method",
          lineAnchor: "bottom",
          textAnchor: "end",
          text: () => "?",
          fontSize: 13,
          className: "y-label-tooltips",
          dx: -11,
          dy: -2,
        }),
        PlotLib.ruleY(data, {
          x1: -0.99,
          x2: 0.99,
          y: "method",
          stroke: grey[400],
          strokeWidth: 1,
          strokeDasharray: 6,
        }),
        PlotLib.dot(data, {
          x: "normalisedScore",
          y: "method",
          r: 12,
          fill: "normalisedScore",
          stroke: grey[100],
          strokeWidth: 4,
          strokeOpacity: 0.8,
          tip: {
            fontSize: 14,
            textPadding: 20,
            textOverflow: "clip",
            format: { x: false, y: false, fill: false, stroke: false },
          },
          channels: {
            method: {
              value: ({ method }: Row) => VARIANT_EFFECT_METHODS[method]?.prettyName ?? null,
              label: "Method:",
            },
            assessment: { value: "assessment", label: "Assessment:" },
            score: { value: "score", label: "Method score:" },
            assessmentFlag: { value: "assessmentFlag", label: "Assessment Flag:" },
            normalisedScore: { value: "normalisedScore", label: "Normalised Score:" },
            license: { value: (d: Row) => getLicense(d.method), label: "License:" },
          },
        }),
      ],
    });

    containerRef.current.append(chart);

    // "?" markers as method-description tooltips
    for (const [index, el] of chart.querySelectorAll(".y-label-tooltips text").entries()) {
      let popup: HTMLDivElement | null = null;
      (el as HTMLElement).style.cursor = "default";
      el.addEventListener("mouseenter", event => {
        popup = document.createElement("div");
        popup.textContent = VARIANT_EFFECT_METHODS[data[index].method]?.description ?? "";
        popup.style.background = theme.palette.background.paper;
        popup.style.border = `1px solid ${theme.palette.grey[300]}`;
        popup.style.color = theme.palette.text.primary;
        popup.style.fontSize = "12px";
        popup.style.padding = "0.3rem 0.5rem";
        popup.style.position = "absolute";
        popup.style.maxWidth = "300px";
        popup.style.zIndex = "9999";
        document.body.appendChild(popup);
        const bbox = (event.currentTarget as Element).getBoundingClientRect();
        popup.style.left = `${bbox.left + window.scrollX - 110}px`;
        popup.style.top = `${bbox.top + window.scrollY - 12 - popup.clientHeight}px`;
      });
      el.addEventListener("mouseleave", () => {
        popup?.remove();
        popup = null;
      });
    }

    return () => chart.remove();
  }, [data, width]);

  return <div ref={containerRef} />;
}

// ---- Root widget ----

export default function VariantEffectWidget({ variantId }: { variantId: string }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [measureRef, { width }] = useMeasure();

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const res = await fetch(OT_GRAPHQL_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: VARIANT_EFFECT_QUERY, variables: { variantId } }),
        });
        const json = await res.json();
        const effects: Row[] = json?.data?.variant?.variantEffect ?? [];
        if (!cancelled) {
          const sorted = [...effects]
            .filter(e => e.method !== null)
            .sort((a, b) =>
              (VARIANT_EFFECT_METHODS[a.method]?.prettyName ?? a.method).localeCompare(
                VARIANT_EFFECT_METHODS[b.method]?.prettyName ?? b.method
              )
            );
          setRows(sorted);
        }
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Failed to load variant effect data.");
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [variantId]);

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" fontStyle="italic">
          {error}
        </Typography>
      </Box>
    );
  }

  if (rows === null) {
    return <Skeleton sx={{ height: 325, mx: 2, my: 2 }} variant="rectangular" />;
  }

  if (rows.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" fontStyle="italic">
          No variant effect data available for this variant.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ px: 2, py: 1 }}>
      <Box sx={{ width: "90%", margin: "0 auto", mb: 2 }} ref={measureRef}>
        <Fade in>
          <div>
            <Plot data={rows} width={width} />
          </div>
        </Fade>
      </Box>
    </Box>
  );
}
