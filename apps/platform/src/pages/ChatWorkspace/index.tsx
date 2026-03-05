import { type KeyboardEvent, type ReactElement, useEffect, useRef, useState } from "react";
import {
  Box,
  CircularProgress,
  Dialog,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  faBug,
  faChartSimple,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faCircleCheck,
  faCircleQuestion,
  faCircleXmark,
  faClockRotateLeft,
  faCompress,
  faDna,
  faExpand,
  faFlask,
  faMicroscope,
  faPaperPlane,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet";
import { NavBar } from "ui";
import { mainMenuItems } from "@ot/constants";
import { AppRenderer } from "@mcp-ui/client";

const CHAT_API_URL = "http://localhost:3001/chat";
const STATUS_URL = "http://localhost:3001/status";
const sandboxUrl = new URL("http://localhost:3001/sandbox_proxy.html");

// ---- Types ----

type Widget = {
  toolName: string;
  toolInput: Record<string, unknown>;
  html: string;
};

type DebugToolCall = { name: string; input: Record<string, unknown>; result: string; isError: boolean };
type DebugStep = { toolCalls: DebugToolCall[]; usage: { input_tokens: number; output_tokens: number } };
type DebugInfo = { steps: DebugStep[]; totalUsage: { input_tokens: number; output_tokens: number }; iterations: number; model: string };

type Message = {
  role: "user" | "assistant";
  text: string;
  widgets?: Widget[];
  historyEntryId?: string; // links an assistant message to its history entry
  debug?: DebugInfo;
};

type HistoryEntry = {
  id: string;
  query: string;
  widgets: Widget[];
};

type McpInfo = { name: string; connected: boolean };
type ServerStatus = { mcps: McpInfo[]; model: string; modelDisplay: string; provider: string };

// ---- Widget helpers ----

function extractEntityId(widgets: Widget[]): string {
  const input = widgets[0]?.toolInput ?? {};
  if (input.ensgId) return String(input.ensgId);
  if (input.variantId) return String(input.variantId);
  if (input.studyLocusId) {
    const s = String(input.studyLocusId);
    return s.length > 18 ? `${s.slice(0, 16)}…` : s;
  }
  if (input.studyId) return String(input.studyId);
  return "—";
}

function widgetShortName(toolName: string): string {
  if (toolName.includes("l2g")) return "L2G";
  if (toolName.includes("variant_effect")) return "Effect";
  if (toolName.includes("molecular")) return "Structure";
  if (toolName.includes("gwas")) return "GWAS";
  if (toolName.includes("shared_trait")) return "Traits";
  if (toolName.includes("baseline")) return "Expression";
  return toolName.replace("get_", "").replace("_widget", "");
}

// ---- Token cost helpers ----

// Haiku 4.5 pricing ($/million tokens)
const PRICE_IN_PER_M = 0.8;
const PRICE_OUT_PER_M = 4.0;

function estimateCost(input: number, output: number): string {
  const cost = (input / 1_000_000) * PRICE_IN_PER_M + (output / 1_000_000) * PRICE_OUT_PER_M;
  if (cost < 0.001) return "<$0.001";
  return `$${cost.toFixed(3)}`;
}

function fmtTokens(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);
}

// ---- Helpers ----

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  text: "Hi! I'm the Open Targets research assistant. I have access to the full Open Targets Platform — I can search targets, diseases, drugs, and variants, run GraphQL queries, and render **6 interactive data widgets** inline.\n\nPress the **?** button in the header to see the full widget guide.\n\nTry asking:\n- **What diseases is BRCA1 associated with?**\n- **Show baseline expression for ENSG00000139618**\n- **Show me the L2G and variant effect widgets for 19_44908822_C_T**\n- **Show GWAS credible sets for GCST90002357**",
};

function getAutoColumns(count: number): number {
  if (count <= 3) return count;
  if (count <= 6) return 3;
  return 4;
}

function toolLabel(widget: Widget) {
  const args = Object.entries(widget.toolInput)
    .map(([k, v]) => `${k}: "${v}"`)
    .join(", ");
  return `${widget.toolName}(${args})`;
}

function renderText(text: string): ReactElement[] {
  return text.split("\n").map((line, i, arr) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={j}>{part.slice(2, -2)}</strong>;
      }
      return part.split(/(`[^`]+`)/g).map((seg, k) => {
        if (seg.startsWith("`") && seg.endsWith("`")) {
          return (
            <code
              key={k}
              style={{ background: "#edf2f7", padding: "1px 4px", borderRadius: 3, fontSize: 12 }}
            >
              {seg.slice(1, -1)}
            </code>
          );
        }
        return seg;
      });
    });
    return (
      <span key={i}>
        {parts}
        {i < arr.length - 1 && <br />}
      </span>
    );
  });
}

// ---- WidgetCard ----

function WidgetCard({
  widget,
  widgetKey,
  height,
  onHeightChange,
}: {
  widget: Widget;
  widgetKey: string;
  height: number;
  onHeightChange: (key: string, h: number) => void;
}): ReactElement {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedHeight, setExpandedHeight] = useState(700);

  return (
    <>
      <Paper variant="outlined" sx={{ overflow: "hidden", borderRadius: 2, borderColor: "#cbd5e0" }}>
        <Box
          sx={{
            px: 2,
            py: 0.75,
            background: "#f7fafc",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: "#48bb78", flexShrink: 0 }} />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
          >
            MCP widget · <code style={{ fontSize: 11 }}>{toolLabel(widget)}</code>
          </Typography>
          <IconButton
            size="small"
            onClick={() => setIsExpanded(true)}
            sx={{ p: 0.5, flexShrink: 0 }}
            title="Expand widget"
            type="button"
          >
            <FontAwesomeIcon icon={faExpand} style={{ fontSize: 11 }} />
          </IconButton>
        </Box>

        <Box sx={{ height, overflow: "hidden" }}>
          <AppRenderer
            toolName={widget.toolName}
            sandbox={{ url: sandboxUrl }}
            html={widget.html}
            toolInput={widget.toolInput}
            onOpenLink={async ({ url }) => {
              window.open(url, "_blank");
              return { isError: false };
            }}
            onSizeChanged={({ height: h }) => {
              if (h !== undefined && h > 0) onHeightChange(widgetKey, Math.max(h, 200));
            }}
            onError={err => console.error("MCP widget error:", err)}
          />
        </Box>
      </Paper>

      <Dialog
        open={isExpanded}
        onClose={() => setIsExpanded(false)}
        maxWidth={false}
        PaperProps={{ sx: { width: "min(92vw, 1440px)", m: 2 } }}
      >
        <Box
          sx={{
            px: 2,
            py: 1,
            background: "#f7fafc",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: "#48bb78", flexShrink: 0 }} />
          <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
            MCP widget · <code style={{ fontSize: 11 }}>{toolLabel(widget)}</code>
          </Typography>
          <IconButton
            size="small"
            onClick={() => setIsExpanded(false)}
            sx={{ p: 0.5 }}
            title="Close"
            type="button"
          >
            <FontAwesomeIcon icon={faXmark} style={{ fontSize: 13 }} />
          </IconButton>
        </Box>
        <Box sx={{ height: expandedHeight, overflow: "hidden" }}>
          <AppRenderer
            toolName={widget.toolName}
            sandbox={{ url: sandboxUrl }}
            html={widget.html}
            toolInput={widget.toolInput}
            onOpenLink={async ({ url }) => {
              window.open(url, "_blank");
              return { isError: false };
            }}
            onSizeChanged={({ height: h }) => {
              if (h !== undefined && h > 0) setExpandedHeight(Math.max(h, 400));
            }}
            onError={err => console.error("MCP widget error (expanded):", err)}
          />
        </Box>
      </Dialog>
    </>
  );
}

// ---- HistoryThought ----

function HistoryThought({
  entry,
  isActive,
  isLast,
  onActivate,
}: {
  entry: HistoryEntry;
  isActive: boolean;
  isLast: boolean;
  onActivate: () => void;
}): ReactElement {
  const entityId = extractEntityId(entry.widgets);
  const widgetNames = [...new Set(entry.widgets.map(w => widgetShortName(w.toolName)))];

  return (
    <Box sx={{ position: "relative", display: "flex", overflow: "hidden" }}>
      {/* Vertical connecting line */}
      {!isLast && (
        <Box
          sx={{
            position: "absolute",
            left: 26,
            top: 34,
            bottom: -4,
            width: 1,
            background: "#e2e8f0",
            zIndex: 0,
          }}
        />
      )}

      <Tooltip title={entry.query} placement="left" arrow>
        <Box
          component="button"
          type="button"
          onClick={onActivate}
          sx={{
            display: "flex",
            gap: 1.25,
            px: 1.5,
            py: 1,
            width: "100%",
            boxSizing: "border-box",
            textAlign: "left",
            background: isActive ? "#eff6ff" : "#fafafa",
            border: "none",
            borderLeft: isActive ? "3px solid #3489ca" : "3px solid transparent",
            cursor: "pointer",
            transition: "all 0.15s",
            position: "relative",
            zIndex: 1,
            appearance: "none",
            WebkitAppearance: "none",
            "&:hover": { background: isActive ? "#dbeafe" : "#f1f5f9" },
          }}
        >
          {/* Dot */}
          <Box sx={{ flexShrink: 0, pt: "1px" }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: isActive ? "#3489ca" : "#fff",
                border: `2px solid ${isActive ? "#3489ca" : "#cbd5e0"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
            >
              <FontAwesomeIcon
                icon={faChartSimple}
                style={{ fontSize: 9, color: isActive ? "#fff" : "#94a3b8" }}
              />
            </Box>
          </Box>

          {/* Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Entity ID */}
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 600,
                color: isActive ? "#1e40af" : "text.secondary",
                fontFamily: "monospace",
                lineHeight: 1.3,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                mb: 0.5,
              }}
            >
              {entityId}
            </Typography>

            {/* Widget type chips */}
            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
              {widgetNames.map(name => (
                <Box
                  key={name}
                  sx={{
                    px: 0.75,
                    py: "2px",
                    borderRadius: "4px",
                    background: isActive ? "#dbeafe" : "#f1f5f9",
                    border: `1px solid ${isActive ? "#93c5fd" : "#e2e8f0"}`,
                  }}
                >
                  <Typography sx={{ fontSize: 9, fontWeight: 600, color: isActive ? "#1e40af" : "#64748b", lineHeight: 1.2 }}>
                    {name}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Tooltip>
    </Box>
  );
}

// ---- DebugPanel ----

function DebugPanel({ debug }: { debug: DebugInfo }): ReactElement {
  const [open, setOpen] = useState(false);

  const totalIn = debug.totalUsage.input_tokens;
  const totalOut = debug.totalUsage.output_tokens;
  const cost = estimateCost(totalIn, totalOut);

  return (
    <Box sx={{ mt: 0.75 }}>
      {/* Toggle row */}
      <Box
        component="button"
        type="button"
        onClick={() => setOpen(v => !v)}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.75,
          px: 1,
          py: 0.375,
          background: open ? "#1e293b" : "#f1f5f9",
          border: "1px solid",
          borderColor: open ? "#334155" : "#e2e8f0",
          borderRadius: "6px",
          cursor: "pointer",
          appearance: "none",
          WebkitAppearance: "none",
          transition: "all 0.15s",
          "&:hover": { borderColor: "#64748b" },
        }}
      >
        <FontAwesomeIcon icon={faBug} style={{ fontSize: 9, color: open ? "#94a3b8" : "#64748b" }} />
        <Typography sx={{ fontSize: 10, fontWeight: 600, color: open ? "#94a3b8" : "#64748b", fontFamily: "monospace" }}>
          {debug.iterations} step{debug.iterations !== 1 ? "s" : ""} · {fmtTokens(totalIn)} in · {fmtTokens(totalOut)} out · {cost}
        </Typography>
        <FontAwesomeIcon
          icon={open ? faChevronUp : faChevronDown}
          style={{ fontSize: 8, color: open ? "#94a3b8" : "#64748b" }}
        />
      </Box>

      {/* Expanded trace */}
      {open && (
        <Box
          sx={{
            mt: 0.5,
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          {debug.steps.map((step, si) => (
            <Box key={si} sx={{ borderBottom: si < debug.steps.length - 1 ? "1px solid #1e293b" : "none" }}>
              {/* Step header */}
              <Box sx={{ px: 1.5, py: 0.75, display: "flex", alignItems: "center", gap: 1, background: "#1e293b" }}>
                <Typography sx={{ fontSize: 9, fontWeight: 700, color: "#64748b", fontFamily: "monospace" }}>
                  STEP {si + 1}
                </Typography>
                <Typography sx={{ fontSize: 9, color: "#475569", fontFamily: "monospace", ml: "auto" }}>
                  {fmtTokens(step.usage.input_tokens)} in · {fmtTokens(step.usage.output_tokens)} out
                </Typography>
              </Box>

              {/* Tool calls */}
              {step.toolCalls.map((tc, ti) => (
                <Box key={ti} sx={{ px: 1.5, py: 1, borderTop: "1px solid #1e293b" }}>
                  {/* Tool name */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.5 }}>
                    <FontAwesomeIcon
                      icon={tc.isError ? faCircleXmark : faCircleCheck}
                      style={{ fontSize: 10, color: tc.isError ? "#ef4444" : "#22c55e", flexShrink: 0 }}
                    />
                    <Typography sx={{ fontSize: 10, fontWeight: 700, color: "#e2e8f0", fontFamily: "monospace" }}>
                      {tc.name}
                    </Typography>
                  </Box>

                  {/* Input args */}
                  <Box sx={{ pl: 2.25 }}>
                    {Object.entries(tc.input).map(([k, v]) => (
                      <Typography key={k} sx={{ fontSize: 9, color: "#94a3b8", fontFamily: "monospace", lineHeight: 1.6 }}>
                        <span style={{ color: "#7dd3fc" }}>{k}</span>
                        {": "}
                        <span style={{ color: "#fde68a" }}>{String(v)}</span>
                      </Typography>
                    ))}

                    {/* Result snippet */}
                    <Box
                      sx={{
                        mt: 0.5,
                        px: 1,
                        py: 0.5,
                        background: tc.isError ? "#450a0a" : "#052e16",
                        borderRadius: "4px",
                        borderLeft: `2px solid ${tc.isError ? "#ef4444" : "#16a34a"}`,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 9,
                          color: tc.isError ? "#fca5a5" : "#86efac",
                          fontFamily: "monospace",
                          lineHeight: 1.5,
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                          display: "-webkit-box",
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {tc.result}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

// ---- Widget documentation ----

type WidgetDoc = {
  name: string;
  toolName: string;
  description: string;
  inputLabel: string;
  inputParam: string;
  inputExample: string;
  exampleQuery: string;
  icon: typeof faDna;
  color: string;
  tags: string[];
};

const WIDGET_DOCS: WidgetDoc[] = [
  {
    name: "Locus-to-Gene (L2G)",
    toolName: "get_l2g_widget",
    description:
      "Interactive heatmap showing gene prioritisation scores and SHAP feature-group contributions for a GWAS credible set. Use this to understand which genes a fine-mapped locus most likely affects.",
    inputLabel: "Study Locus ID",
    inputParam: "studyLocusId",
    inputExample: "184646618bb06f7679ceaa7f5ef747f7",
    exampleQuery: "Show me the L2G widget for studyLocusId 184646618bb06f7679ceaa7f5ef747f7",
    icon: faChartSimple,
    color: "#6366f1",
    tags: ["GWAS", "Fine-mapping", "Gene prioritisation"],
  },
  {
    name: "Variant Effect",
    toolName: "get_variant_effect_widget",
    description:
      "Dot plot of in-silico pathogenicity predictor scores (AlphaMissense, SIFT, LOFTEE, FoldX, GERP, VEP, LoF curation) normalised from likely benign to likely deleterious.",
    inputLabel: "Variant ID",
    inputParam: "variantId",
    inputExample: "19_44908822_C_T",
    exampleQuery: "Show variant effect scores for 19_44908822_C_T",
    icon: faMicroscope,
    color: "#f59e0b",
    tags: ["Variant", "Pathogenicity", "In-silico predictors"],
  },
  {
    name: "Molecular Structure",
    toolName: "get_molecular_structure_widget",
    description:
      "3D AlphaFold protein structure viewer with the variant residue highlighted and the structure coloured by pLDDT confidence score.",
    inputLabel: "Variant ID",
    inputParam: "variantId",
    inputExample: "19_44908822_C_T",
    exampleQuery: "Show 3D molecular structure for variant 19_44908822_C_T",
    icon: faDna,
    color: "#10b981",
    tags: ["Variant", "Protein structure", "AlphaFold"],
  },
  {
    name: "GWAS Credible Sets",
    toolName: "get_gwas_credible_sets_widget",
    description:
      "Manhattan plot of credible set genomic distribution plus a table with lead variants, p-values, fine-mapping confidence, and top L2G gene scores for a study.",
    inputLabel: "Study ID",
    inputParam: "studyId",
    inputExample: "GCST90002357",
    exampleQuery: "Show GWAS credible sets for study GCST90002357",
    icon: faChartSimple,
    color: "#3b82f6",
    tags: ["GWAS", "Fine-mapping", "Credible sets"],
  },
  {
    name: "Shared Trait Studies",
    toolName: "get_shared_trait_studies_widget",
    description:
      "Table of other GWAS studies sharing the same disease/phenotype associations as a given study, with sample sizes, cohorts, and publications.",
    inputLabel: "Study ID",
    inputParam: "studyId",
    inputExample: "GCST90002357",
    exampleQuery: "What other studies share traits with GCST90002357?",
    icon: faFlask,
    color: "#8b5cf6",
    tags: ["GWAS", "Phenotype", "Studies"],
  },
  {
    name: "Baseline Expression",
    toolName: "get_baseline_expression_widget",
    description:
      "Tissue and cell-type expression profiles (Summary tab) plus GTEx expression variability across tissues (Variation tab) for a target gene.",
    inputLabel: "Ensembl Gene ID",
    inputParam: "ensgId",
    inputExample: "ENSG00000139618",
    exampleQuery: "Show baseline expression for BRCA2 (ENSG00000139618)",
    icon: faDna,
    color: "#ec4899",
    tags: ["Gene", "Expression", "GTEx"],
  },
];

// ---- HelpPanel ----

function HelpPanel({ open, onClose }: { open: boolean; onClose: () => void }): ReactElement {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{ sx: { width: "min(92vw, 860px)", m: 2, borderRadius: 2 } }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2,
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <FontAwesomeIcon icon={faCircleQuestion} style={{ fontSize: 16, color: "#3489ca" }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2 }}>
            Widget Guide
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Interactive data widgets available in this workspace
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} type="button" sx={{ p: 0.5 }}>
          <FontAwesomeIcon icon={faXmark} style={{ fontSize: 14 }} />
        </IconButton>
      </Box>

      {/* Body */}
      <Box sx={{ overflowY: "auto", maxHeight: "80vh", px: 3, py: 2.5 }}>
        {/* Intro */}
        <Box
          sx={{
            mb: 3,
            px: 2,
            py: 1.5,
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: 2,
          }}
        >
          <Typography variant="body2" color="#1e40af" sx={{ lineHeight: 1.6 }}>
            Just describe what you want in plain language — the assistant will pick the right widget
            and ID automatically. You can also combine multiple widgets in one query.
          </Typography>
        </Box>

        {/* Widget cards */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {WIDGET_DOCS.map(w => (
            <Box
              key={w.toolName}
              sx={{
                border: "1px solid #e2e8f0",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              {/* Card header */}
              <Box
                sx={{
                  px: 2,
                  py: 1.25,
                  background: "#f8fafc",
                  borderBottom: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                }}
              >
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: `${w.color}18`,
                    border: `1.5px solid ${w.color}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <FontAwesomeIcon icon={w.icon} style={{ fontSize: 11, color: w.color }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                    {w.name}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 10,
                      fontFamily: "monospace",
                      color: "text.secondary",
                      lineHeight: 1.3,
                    }}
                  >
                    {w.toolName}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  {w.tags.map(tag => (
                    <Box
                      key={tag}
                      sx={{
                        px: 0.75,
                        py: "2px",
                        borderRadius: "4px",
                        background: `${w.color}14`,
                        border: `1px solid ${w.color}30`,
                      }}
                    >
                      <Typography sx={{ fontSize: 9, fontWeight: 600, color: w.color }}>
                        {tag}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Card body */}
              <Box sx={{ px: 2, py: 1.5, display: "flex", flexDirection: "column", gap: 1.25 }}>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {w.description}
                </Typography>

                {/* Input info */}
                <Box sx={{ display: "flex", gap: 1, alignItems: "baseline", flexWrap: "wrap" }}>
                  <Typography
                    sx={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "text.secondary",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Input:
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {w.inputLabel}
                  </Typography>
                  <Box
                    sx={{
                      px: 0.75,
                      py: "1px",
                      background: "#f1f5f9",
                      border: "1px solid #e2e8f0",
                      borderRadius: "4px",
                    }}
                  >
                    <Typography
                      sx={{ fontSize: 10, fontFamily: "monospace", color: "text.secondary" }}
                    >
                      {w.inputParam}: "{w.inputExample}"
                    </Typography>
                  </Box>
                </Box>

                {/* Example query */}
                <Box
                  sx={{
                    px: 1.25,
                    py: 1,
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    display: "flex",
                    gap: 1,
                    alignItems: "flex-start",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#94a3b8",
                      mt: "1px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Try:
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: "#1e40af", fontStyle: "italic" }}>
                    "{w.exampleQuery}"
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Tips */}
        <Box sx={{ mt: 3, pt: 2.5, borderTop: "1px solid #e2e8f0" }}>
          <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: "block", mb: 1 }}>
            TIPS
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            {[
              "You can request multiple widgets in one message — they'll appear side-by-side in the workspace.",
              'Click \u201cshow in workspace\u201d on any message to revisit a previous widget set.',
              "Use the column selector (1\u20134) in the workspace header to change the grid layout.",
              "Click the expand icon on any widget card for a full-screen view.",
            ].map((tip, i) => (
              <Box key={i} sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "#f1f5f9",
                    border: "1px solid #e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    mt: "1px",
                  }}
                >
                  <Typography sx={{ fontSize: 8, fontWeight: 700, color: "#94a3b8" }}>{i + 1}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                  {tip}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}

// ---- ChatWorkspacePage ----

function ChatWorkspacePage(): ReactElement {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [widgetHeights, setWidgetHeights] = useState<Record<string, number>>({});
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const [isSplit, setIsSplit] = useState(false);
  const [isThoughtsOpen, setIsThoughtsOpen] = useState(true);
  const [columns, setColumns] = useState(1);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const historyBottomRef = useRef<HTMLDivElement>(null);

  const activeEntry = history.find(e => e.id === activeHistoryId) ?? null;

  const sessionTokens = messages.reduce(
    (acc, m) => {
      if (!m.debug) return acc;
      return {
        input: acc.input + m.debug.totalUsage.input_tokens,
        output: acc.output + m.debug.totalUsage.output_tokens,
      };
    },
    { input: 0, output: 0 }
  );

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    historyBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch(STATUS_URL);
        if (res.ok) setServerStatus(await res.json());
      } catch {
        // server not reachable — keep last known status
      }
    }
    fetchStatus();
    const id = setInterval(fetchStatus, 10_000);
    return () => clearInterval(id);
  }, []);

  function handleHeightChange(key: string, h: number) {
    setWidgetHeights(prev => ({ ...prev, [key]: h }));
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: Message = { role: "user", text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const apiMessages = updatedMessages.map(m => ({ role: m.role, content: m.text }));
      const res = await fetch(CHAT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();

      let historyEntryId: string | undefined;
      if (data.widgets?.length > 0) {
        const entry: HistoryEntry = {
          id: crypto.randomUUID(),
          query: text,
          widgets: data.widgets,
        };
        historyEntryId = entry.id;
        setHistory(prev => [...prev, entry]);
        setActiveHistoryId(entry.id);
        setIsSplit(true);
        setColumns(getAutoColumns(data.widgets.length));
      }

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          text: data.text ?? "",
          widgets: data.widgets ?? [],
          historyEntryId,
          debug: data.debug ?? undefined,
        },
      ]);
    } catch (err) {
      const errorText = err instanceof Error ? err.message : "Unknown error";
      setMessages(prev => [
        ...prev,
        { role: "assistant", text: `Sorry, something went wrong: ${errorText}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function activateHistory(id: string) {
    const entry = history.find(e => e.id === id);
    if (!entry) return;
    setActiveHistoryId(id);
    setColumns(getAutoColumns(entry.widgets.length));
    if (!isSplit) setIsSplit(true);
  }

  const panelTransition = "width 0.4s cubic-bezier(0.4,0,0.2,1)";
  const chatWidth = isSplit ? "320px" : "100%";
  const historyWidth = isSplit ? (isThoughtsOpen ? "220px" : "40px") : "0px";

  return (
    <>
      <Helmet>
        <title>Chat Workspace · Open Targets Platform</title>
      </Helmet>

      <NavBar name="platform" items={mainMenuItems} placement="bottom-end" />

      <HelpPanel open={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      <Box sx={{ display: "flex", height: "calc(100vh - 64px)", overflow: "hidden" }}>

        {/* ── LEFT: Chat panel ── */}
        <Box
          sx={{
            width: chatWidth,
            minWidth: 0,
            transition: panelTransition,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            borderRight: isSplit ? "1px solid #e2e8f0" : "none",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
              flexShrink: 0,
            }}
          >
            <Box sx={{ maxWidth: isSplit ? "none" : 720, mx: "auto", width: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                <Typography
                  variant={isSplit ? "caption" : "h6"}
                  fontWeight={700}
                  sx={{ transition: "font-size 0.3s", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                >
                  {isSplit ? "OT Assistant" : "Open Targets Research Assistant"}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
                  {!isSplit && serverStatus && (
                    <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                      {serverStatus.modelDisplay}
                    </Typography>
                  )}
                  <Tooltip title="Widget guide" placement="bottom">
                    <IconButton
                      size="small"
                      onClick={() => setIsHelpOpen(true)}
                      type="button"
                      sx={{ p: 0.5, color: "#3489ca" }}
                    >
                      <FontAwesomeIcon icon={faCircleQuestion} style={{ fontSize: 13 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={isSplit ? "Full chat view" : "Open workspace"} placement="bottom">
                    <IconButton
                      size="small"
                      onClick={() => setIsSplit(v => !v)}
                      type="button"
                      sx={{ p: 0.5 }}
                    >
                      <FontAwesomeIcon icon={isSplit ? faCompress : faExpand} style={{ fontSize: 13 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {/* MCP status dots */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                {serverStatus ? (
                  serverStatus.mcps.map(mcp => (
                    <Box key={mcp.name} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          flexShrink: 0,
                          background: mcp.connected ? "#48bb78" : "#cbd5e0",
                          boxShadow: mcp.connected ? "0 0 0 2px #c6f6d540" : "none",
                        }}
                      />
                      {!isSplit && (
                        <Typography variant="caption" color="text.secondary">
                          {mcp.name}
                        </Typography>
                      )}
                    </Box>
                  ))
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    Connecting…
                  </Typography>
                )}
              </Box>

              {/* Session token counter — only shown once there's at least one debug entry */}
              {sessionTokens.input > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    mt: 0.5,
                    px: 1,
                    py: 0.375,
                    background: "#0f172a",
                    borderRadius: "6px",
                    width: "fit-content",
                  }}
                >
                  <FontAwesomeIcon icon={faBug} style={{ fontSize: 8, color: "#475569" }} />
                  <Typography sx={{ fontSize: 9, fontFamily: "monospace", color: "#64748b" }}>
                    <span style={{ color: "#7dd3fc" }}>{fmtTokens(sessionTokens.input)}</span>
                    {" in · "}
                    <span style={{ color: "#86efac" }}>{fmtTokens(sessionTokens.output)}</span>
                    {" out · "}
                    <span style={{ color: "#fde68a" }}>{estimateCost(sessionTokens.input, sessionTokens.output)}</span>
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Message list */}
          <Box sx={{ flex: 1, overflowY: "auto", py: 1.5 }}>
            <Box sx={{ maxWidth: 720, mx: "auto" }}>
            {messages.map((msg, i) => {
              const isUser = msg.role === "user";
              const hasWidgets = (msg.widgets?.length ?? 0) > 0;
              return (
                <Box key={i} sx={{ px: 1.5, mb: 1.5 }}>
                  <Box sx={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
                    <Paper
                      elevation={0}
                      sx={{
                        px: 1.5,
                        py: 1,
                        maxWidth: "88%",
                        borderRadius: isUser ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                        background: isUser ? "#3b82f6" : "#f1f5f9",
                        color: isUser ? "#fff" : "text.primary",
                      }}
                    >
                      <Typography variant="caption" component="div" sx={{ lineHeight: 1.55 }}>
                        {renderText(msg.text)}
                      </Typography>
                    </Paper>
                  </Box>

                  {/* Debug panel */}
                  {!isUser && msg.debug && msg.debug.iterations > 0 && (
                    <DebugPanel debug={msg.debug} />
                  )}

                  {/* Widget badge — links this message to the workspace */}
                  {!isUser && hasWidgets && msg.historyEntryId && (
                    <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 0.5 }}>
                      <Box
                        component="button"
                        type="button"
                        onClick={() => activateHistory(msg.historyEntryId!)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.75,
                          px: 1,
                          py: 0.4,
                          background: activeHistoryId === msg.historyEntryId ? "#eff6ff" : "#f8fafc",
                          border: "1px solid",
                          borderColor: activeHistoryId === msg.historyEntryId ? "#3489ca" : "#e2e8f0",
                          borderRadius: 10,
                          cursor: "pointer",
                          transition: "all 0.15s",
                          appearance: "none",
                          WebkitAppearance: "none",
                          "&:hover": { borderColor: "#3489ca", background: "#eff6ff" },
                        }}
                      >
                        <FontAwesomeIcon icon={faChartSimple} style={{ fontSize: 10, color: "#3489ca" }} />
                        <Typography sx={{ fontSize: 10, color: "#3489ca", fontWeight: 600 }}>
                          {msg.widgets!.length} widget{msg.widgets!.length !== 1 ? "s" : ""} · show in workspace
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              );
            })}

            {loading && (
              <Box sx={{ px: 1.5, display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <CircularProgress size={14} />
                <Typography variant="caption" color="text.secondary">
                  Thinking…
                </Typography>
              </Box>
            )}

            <div ref={chatBottomRef} />
            </Box>
          </Box>

          {/* Input */}
          <Box sx={{ px: 2, py: 1.5, borderTop: "1px solid #e2e8f0", flexShrink: 0 }}>
            <Box sx={{ maxWidth: 720, mx: "auto", display: "flex", gap: 1, alignItems: "flex-end" }}>
              <TextField
                fullWidth
                multiline
                maxRows={4}
                size="small"
                placeholder={isSplit ? "Ask a question…" : "Ask a question or paste a credible set study locus ID…"}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
              <IconButton
                color="primary"
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                sx={{ mb: "2px", flexShrink: 0 }}
                aria-label="Send message"
                type="button"
              >
                <FontAwesomeIcon icon={faPaperPlane} style={{ fontSize: 14 }} />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* ── CENTER: Widget canvas ── */}
        <Box
          sx={{
            flex: isSplit ? 1 : 0,
            minWidth: 0,
            transition: "flex 0.4s cubic-bezier(0.4,0,0.2,1)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid #e2e8f0",
          }}
        >
          {isSplit && (
            <>
              {/* Widget panel header */}
              <Box
                sx={{
                  px: 2,
                  py: 1.25,
                  borderBottom: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexShrink: 0,
                }}
              >
                {activeEntry ? (
                  <>
                    <FontAwesomeIcon icon={faChartSimple} style={{ fontSize: 13, color: "#3489ca" }} />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                    >
                      {activeEntry.query}
                    </Typography>
                    {/* Column controls */}
                    {activeEntry.widgets.length > 1 && (
                      <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
                        {[1, 2, 3, 4].filter(c => c <= Math.min(activeEntry.widgets.length, 4)).map(c => (
                          <Box
                            key={c}
                            component="button"
                            type="button"
                            onClick={() => setColumns(c)}
                            sx={{
                              width: 22,
                              height: 22,
                              border: "1px solid",
                              borderColor: columns === c ? "primary.main" : "#cbd5e0",
                              borderRadius: 1,
                              background: columns === c ? "primary.main" : "transparent",
                              color: columns === c ? "#fff" : "text.secondary",
                              fontSize: 11,
                              fontWeight: 600,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              "&:hover": { borderColor: "primary.main" },
                            }}
                          >
                            {c}
                          </Box>
                        ))}
                      </Box>
                    )}
                  </>
                ) : (
                  <Typography variant="caption" color="text.disabled">
                    Workspace
                  </Typography>
                )}
              </Box>

              {/* Widgets or empty state */}
              <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
                {activeEntry ? (
                  <Box sx={{ maxWidth: 1400, mx: "auto" }}>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                        gap: 1.5,
                      }}
                    >
                      {activeEntry.widgets.map((widget, wi) => {
                        const key = `${activeEntry.id}-${wi}`;
                        return (
                          <WidgetCard
                            key={key}
                            widget={widget}
                            widgetKey={key}
                            height={widgetHeights[key] ?? 450}
                            onHeightChange={handleHeightChange}
                          />
                        );
                      })}
                    </Box>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 2,
                      color: "text.disabled",
                    }}
                  >
                    <FontAwesomeIcon icon={faChartSimple} style={{ fontSize: 32, opacity: 0.3 }} />
                    <Typography variant="body2" color="text.disabled">
                      Ask a question to see widgets here
                    </Typography>
                  </Box>
                )}
              </Box>
            </>
          )}
        </Box>

        {/* ── RIGHT: History panel ── */}
        <Box
          sx={{
            width: historyWidth,
            flexShrink: 0,
            transition: panelTransition,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            background: "#fafafa",
            borderLeft: isSplit ? "1px solid #e2e8f0" : "none",
          }}
        >
          {isSplit && (
            <>
              {/* History header */}
              <Box
                sx={{
                  px: 1,
                  py: 1.25,
                  borderBottom: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexShrink: 0,
                  minWidth: 0,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, overflow: "hidden" }}>
                  <FontAwesomeIcon icon={faClockRotateLeft} style={{ fontSize: 11, color: "#94a3b8", flexShrink: 0 }} />
                  {isThoughtsOpen && (
                    <Typography variant="caption" fontWeight={600} color="text.secondary" noWrap>
                      Thoughts
                    </Typography>
                  )}
                </Box>
                <Tooltip title={isThoughtsOpen ? "Collapse" : "Expand thoughts"} placement="left">
                  <IconButton
                    size="small"
                    type="button"
                    onClick={() => setIsThoughtsOpen(v => !v)}
                    sx={{ p: 0.5, flexShrink: 0 }}
                  >
                    <FontAwesomeIcon
                      icon={isThoughtsOpen ? faChevronRight : faChevronLeft}
                      style={{ fontSize: 10, color: "#94a3b8" }}
                    />
                  </IconButton>
                </Tooltip>
              </Box>

              {/* History list — only shown when open */}
              {isThoughtsOpen && (
                <Box sx={{ flex: 1, overflowY: "auto", overflowX: "hidden", py: 1 }}>
                  {history.length === 0 ? (
                    <Typography
                      variant="caption"
                      color="text.disabled"
                      sx={{ display: "block", px: 1.5, textAlign: "center", mt: 4 }}
                    >
                      No history yet
                    </Typography>
                  ) : (
                    history.map((entry, i) => (
                      <HistoryThought
                        key={entry.id}
                        entry={entry}
                        isActive={entry.id === activeHistoryId}
                        isLast={i === history.length - 1}
                        onActivate={() => activateHistory(entry.id)}
                      />
                    ))
                  )}
                  <div ref={historyBottomRef} />
                </Box>
              )}

              {/* Collapsed state — show dots for each history entry */}
              {!isThoughtsOpen && (
                <Box sx={{ flex: 1, overflowY: "auto", overflowX: "hidden", py: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                  {history.map(entry => {
                    const isActive = entry.id === activeHistoryId;
                    return (
                      <Tooltip key={entry.id} title={entry.query} placement="left" arrow>
                        <Box
                          component="button"
                          type="button"
                          onClick={() => activateHistory(entry.id)}
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            background: isActive ? "#3489ca" : "#fff",
                            border: `2px solid ${isActive ? "#3489ca" : "#cbd5e0"}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            appearance: "none",
                            WebkitAppearance: "none",
                            flexShrink: 0,
                            transition: "all 0.15s",
                            "&:hover": { background: "#3489ca", borderColor: "#3489ca" },
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faChartSimple}
                            style={{ fontSize: 9, color: isActive ? "#fff" : "#94a3b8" }}
                          />
                        </Box>
                      </Tooltip>
                    );
                  })}
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
    </>
  );
}

export default ChatWorkspacePage;
