import { type ReactElement, useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Helmet } from "react-helmet";
import { Footer, NavBar } from "ui";
import { externalLinks, mainMenuItems } from "@ot/constants";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { AppRenderer, UI_EXTENSION_CAPABILITIES } from "@mcp-ui/client";
import type { ClientCapabilitiesWithExtensions } from "@mcp-ui/client";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

const MCP_SERVER_URL = "http://localhost:3001/mcp";
const MCP_UI_RESOURCE_MIME = "text/html;profile=mcp-app";
const DEFAULT_STUDY_LOCUS_ID = "184646618bb06f7679ceaa7f5ef747f7";

type ConnectionStatus = "idle" | "connecting" | "connected" | "error";

function StatusChip({ status }: { status: ConnectionStatus }): ReactElement {
  const map: Record<
    ConnectionStatus,
    { label: string; color: "default" | "warning" | "success" | "error" }
  > = {
    idle: { label: "Not connected", color: "default" },
    connecting: { label: "Connecting…", color: "warning" },
    connected: { label: "Connected", color: "success" },
    error: { label: "Server unreachable", color: "error" },
  };
  const { label, color } = map[status];
  return <Chip label={label} color={color} size="small" />;
}

/** Extract the HTML string from a UIResource content item returned by the MCP server */
function extractHtmlFromToolResult(result: CallToolResult): string | null {
  for (const item of result.content) {
    if (item.type === "resource") {
      const res = (item as { type: "resource"; resource: { mimeType?: string; text?: string } })
        .resource;
      if (res.mimeType === MCP_UI_RESOURCE_MIME && res.text) {
        return res.text;
      }
    }
  }
  return null;
}

function MCPDemoPage(): ReactElement {
  const [studyLocusId, setStudyLocusId] = useState(DEFAULT_STUDY_LOCUS_ID);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("idle");
  const [widgetHtml, setWidgetHtml] = useState<string | null>(null);
  const [loadingWidget, setLoadingWidget] = useState(false);
  const [widgetError, setWidgetError] = useState<string | null>(null);
  // Height reported by the widget via AppBridge size-changed notifications.
  // Starts at 600 px (AppFrame's own default) so there's never a flash of
  // zero-height before the first notification arrives.
  const [widgetHeight, setWidgetHeight] = useState(600);
  const clientRef = useRef<Client | null>(null);

  // Proxy must be on a DIFFERENT origin than the host app.
  // We serve it from the MCP server (port 3001) while the app runs on port 3000.
  const sandboxUrl = new URL("http://localhost:3001/sandbox_proxy.html");

  useEffect(() => {
    let cancelled = false;

    async function connect() {
      setConnectionStatus("connecting");
      try {
        const capabilities: ClientCapabilitiesWithExtensions = {
          roots: { listChanged: true },
          extensions: UI_EXTENSION_CAPABILITIES,
        };
        const client = new Client({ name: "ot-platform-demo", version: "0.1.0" }, { capabilities });
        const transport = new StreamableHTTPClientTransport(new URL(MCP_SERVER_URL));
        await client.connect(transport);

        if (!cancelled) {
          clientRef.current = client;
          setConnectionStatus("connected");
        } else {
          await client.close();
        }
      } catch {
        if (!cancelled) setConnectionStatus("error");
      }
    }

    connect();

    return () => {
      cancelled = true;
      clientRef.current?.close();
      clientRef.current = null;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const id = studyLocusId.trim();
    if (!id || !clientRef.current) return;

    setSubmittedId(id);
    setWidgetHtml(null);
    setWidgetError(null);
    setWidgetHeight(600);
    setLoadingWidget(true);

    try {
      // Call the MCP tool — server fetches OT data and returns a UIResource (HTML)
      const result = await clientRef.current.callTool({
        name: "get_l2g_widget",
        arguments: { studyLocusId: id },
      });

      const html = extractHtmlFromToolResult(result as CallToolResult);
      if (!html) throw new Error("No HTML resource in tool response");
      setWidgetHtml(html);
    } catch (err) {
      setWidgetError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoadingWidget(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>MCP UI Demo · Open Targets Platform</title>
      </Helmet>

      <NavBar name="platform" items={mainMenuItems} placement="bottom-end" />

      <Box sx={{ maxWidth: 900, mx: "auto", px: 3, py: 5 }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
          <Typography variant="h4" component="h1" fontWeight={700}>
            MCP UI Demo
          </Typography>
          <StatusChip status={connectionStatus} />
        </Box>
        <Typography variant="body1" color="text.secondary" mb={3}>
          Demonstrates a UI component served dynamically via the{" "}
          <strong>Model Context Protocol</strong>. The L2G heatmap widget is generated on a local
          MCP server, returned as a{" "}
          <code style={{ background: "#f0f4f8", padding: "1px 4px", borderRadius: 3 }}>
            text/html;profile=mcp-app
          </code>{" "}
          resource, and rendered in a sandboxed iframe by{" "}
          <code style={{ background: "#f0f4f8", padding: "1px 4px", borderRadius: 3 }}>
            @mcp-ui/client
          </code>
          .
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/* Architecture callout */}
        <Paper
          variant="outlined"
          sx={{ p: 2, mb: 3, background: "#f7fafc", borderColor: "#cbd5e0" }}
        >
          <Typography
            variant="caption"
            fontWeight={700}
            color="text.secondary"
            display="block"
            mb={1}
          >
            FLOW
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
            {[
              "client.callTool(get_l2g_widget)",
              "→",
              "server fetches OT GraphQL API",
              "→",
              "returns UIResource (HTML)",
              "→",
              "AppRenderer renders in sandboxed iframe",
            ].map((step, i) =>
              step === "→" ? (
                <Typography key={i} color="text.disabled" fontSize={13}>
                  →
                </Typography>
              ) : (
                <Box
                  key={i}
                  component="code"
                  sx={{
                    background: "#edf2f7",
                    px: "6px",
                    py: "2px",
                    borderRadius: 1,
                    fontSize: 12,
                  }}
                >
                  {step}
                </Box>
              )
            )}
          </Box>
        </Paper>

        {/* Connection error */}
        {connectionStatus === "error" && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <strong>MCP server not reachable at {MCP_SERVER_URL}</strong>
            <br />
            Start it with:
            <Box
              component="code"
              sx={{
                display: "block",
                mt: 1,
                background: "#1a202c",
                color: "#68d391",
                p: "8px 12px",
                borderRadius: 1,
                fontSize: 12,
              }}
            >
              cd apps/mcp-widgets-server &amp;&amp; yarn install &amp;&amp; yarn dev
            </Box>
          </Alert>
        )}

        {/* Input form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", gap: 2, mb: 4, alignItems: "flex-start" }}
        >
          <TextField
            label="Study Locus ID"
            value={studyLocusId}
            onChange={e => setStudyLocusId(e.target.value)}
            size="small"
            sx={{ flex: 1 }}
            placeholder="e.g. 7d68cc9c70351c9dbd2a2c0c145e555d"
            helperText="Find IDs at platform.opentargets.org under any credible set page"
          />
          <Button
            type="submit"
            variant="contained"
            disabled={connectionStatus !== "connected" || !studyLocusId.trim() || loadingWidget}
            sx={{ mt: "2px", minWidth: 130 }}
          >
            {loadingWidget ? <CircularProgress size={18} color="inherit" /> : "Load Widget"}
          </Button>
        </Box>

        {/* Widget error */}
        {widgetError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {widgetError}
          </Alert>
        )}

        {/* Widget area */}
        {connectionStatus === "connecting" && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 4 }}>
            <CircularProgress size={20} />
            <Typography color="text.secondary">Connecting to MCP server…</Typography>
          </Box>
        )}

        {widgetHtml && submittedId && (
          <Paper
            elevation={0}
            variant="outlined"
            sx={{ overflow: "hidden", borderRadius: 2, borderColor: "#cbd5e0" }}
          >
            {/* Widget header bar */}
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
              <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: "#48bb78" }} />
              <Typography variant="caption" color="text.secondary">
                MCP widget ·{" "}
                <code style={{ fontSize: 11 }}>get_l2g_widget({submittedId})</code> · served as{" "}
                <code style={{ fontSize: 11 }}>text/html;profile=mcp-app</code>
              </Typography>
            </Box>

            {/* AppRenderer renders the HTML in a sandboxed double-iframe via the proxy.
                The Box gives AppFrame's inner div an explicit pixel height so that its
                height:100% resolves correctly.  widgetHeight tracks the content size
                reported by the widget via AppBridge size-changed notifications. */}
            <Box sx={{ height: widgetHeight, overflow: "hidden" }}>
              <AppRenderer
                toolName="get_l2g_widget"
                sandbox={{ url: sandboxUrl }}
                html={widgetHtml}
                toolInput={{ studyLocusId: submittedId }}
                onOpenLink={async ({ url }) => {
                  window.open(url, "_blank");
                  return { isError: false };
                }}
                onSizeChanged={({ height }) => {
                  if (height !== undefined && height > 0) {
                    setWidgetHeight(Math.max(height, 200));
                  }
                }}
                onError={err => console.error("MCP widget error:", err)}
              />
            </Box>
          </Paper>
        )}

        {connectionStatus === "connected" && !widgetHtml && !loadingWidget && !widgetError && (
          <Box
            sx={{
              border: "2px dashed",
              borderColor: "#cbd5e0",
              borderRadius: 2,
              py: 6,
              textAlign: "center",
            }}
          >
            <Typography color="text.secondary">
              Enter a Study Locus ID and click <strong>Load Widget</strong>
            </Typography>
          </Box>
        )}
      </Box>

      <Footer externalLinks={externalLinks} />
    </>
  );
}

export default MCPDemoPage;
