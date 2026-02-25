import { type KeyboardEvent, type ReactElement, useEffect, useRef, useState } from "react";
import {
  Box,
  CircularProgress,
  Dialog,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { faExpand, faPaperPlane, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet";
import { NavBar } from "ui";
import { mainMenuItems } from "@ot/constants";
import { AppRenderer } from "@mcp-ui/client";

const CHAT_API_URL = "http://localhost:3001/chat";
const STATUS_URL = "http://localhost:3001/status";
const sandboxUrl = new URL("http://localhost:3001/sandbox_proxy.html");

// Width of the chat text column — header, bubbles, input all share this.
const CHAT_MAX_WIDTH = 860;
// Widgets get more room to breathe.
const WIDGET_MAX_WIDTH = 1400;

type Widget = {
  toolName: string;
  toolInput: Record<string, unknown>;
  html: string;
};

type McpInfo = { name: string; connected: boolean };
type ServerStatus = { mcps: McpInfo[]; model: string; modelDisplay: string; provider: string };

type Message = {
  role: "user" | "assistant";
  text: string;
  widgets?: Widget[];
};

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  text: "Hi! I'm the Open Targets research assistant. I have access to the full Open Targets Platform — I can search targets, diseases, drugs, and variants, run GraphQL queries, and show interactive data widgets inline.\n\nTry asking:\n- **What diseases is BRCA1 associated with?**\n- **Search for drugs targeting PCSK9**\n- **Show me the L2G widget for 184646618bb06f7679ceaa7f5ef747f7**",
};

function toolLabel(widget: Widget) {
  const args = Object.entries(widget.toolInput)
    .map(([k, v]) => `${k}: "${v}"`)
    .join(", ");
  return `${widget.toolName}(${args})`;
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
          <IconButton size="small" onClick={() => setIsExpanded(false)} sx={{ p: 0.5 }} title="Close">
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

// ---- MessageBubble ----

function MessageBubble({
  message,
  messageIndex,
  widgetHeights,
  onHeightChange,
}: {
  message: Message;
  messageIndex: number;
  widgetHeights: Record<string, number>;
  onHeightChange: (key: string, h: number) => void;
}): ReactElement {
  const isUser = message.role === "user";
  const widgetCount = message.widgets?.length ?? 0;
  const [isGridView, setIsGridView] = useState(widgetCount > 1);

  const renderText = (text: string) => {
    return text.split("\n").map((line, i) => {
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
          {i < text.split("\n").length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <Box sx={{ mb: 2 }}>
      {/* Text bubble — constrained to the chat column width */}
      <Box sx={{ maxWidth: CHAT_MAX_WIDTH, mx: "auto", px: 2, width: "100%" }}>
        <Box sx={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
          <Box sx={{ maxWidth: isUser ? "60%" : "75%", width: isUser ? undefined : "100%" }}>
            <Paper
              elevation={0}
              sx={{
                px: 2,
                py: 1.5,
                borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                background: isUser ? "#3b82f6" : "#f1f5f9",
                color: isUser ? "#fff" : "text.primary",
              }}
            >
              <Typography variant="body2" component="div" sx={{ lineHeight: 1.6 }}>
                {renderText(message.text)}
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Widget section — uses WIDGET_MAX_WIDTH so it extends beyond the chat column.
          On screens wider than 860px this visually "breaks out" of the text boundaries. */}
      {!isUser && widgetCount > 0 && (
        <Box sx={{ maxWidth: WIDGET_MAX_WIDTH, mx: "auto", px: 2, width: "100%", mt: 1.5 }}>
          {widgetCount > 1 && (
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
              <IconButton
                size="small"
                onClick={() => setIsGridView(v => !v)}
                title={isGridView ? "Switch to list view" : "Switch to grid view"}
                sx={{ p: 0.5, fontSize: 14, color: "text.secondary" }}
              >
                {isGridView ? "☰" : "⊞"}
              </IconButton>
            </Box>
          )}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                isGridView && widgetCount > 1 ? "repeat(2, minmax(0, 1fr))" : "1fr",
              gap: 1.5,
            }}
          >
            {message.widgets!.map((widget, wi) => {
              const key = `${messageIndex}-${wi}`;
              return (
                <WidgetCard
                  key={key}
                  widget={widget}
                  widgetKey={key}
                  height={widgetHeights[key] ?? 450}
                  onHeightChange={onHeightChange}
                />
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
}

// ---- ChatDemoPage ----

function ChatDemoPage(): ReactElement {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [widgetHeights, setWidgetHeights] = useState<Record<string, number>>({});
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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

      setMessages(prev => [
        ...prev,
        { role: "assistant", text: data.text ?? "", widgets: data.widgets ?? [] },
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

  return (
    <>
      <Helmet>
        <title>Chat Demo · Open Targets Platform</title>
      </Helmet>

      <NavBar name="platform" items={mainMenuItems} placement="bottom-end" />

      {/* Outer container is full-width. Each inner section controls its own max-width. */}
      <Box sx={{ display: "flex", flexDirection: "column", height: "calc(100vh - 64px)" }}>

        {/* Header — chat column width */}
        <Box sx={{ maxWidth: CHAT_MAX_WIDTH, mx: "auto", px: 2, width: "100%", py: 2, borderBottom: "1px solid #e2e8f0" }}>
          <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 2 }}>
            <Typography variant="h6" fontWeight={700}>
              Open Targets Research Assistant
            </Typography>
            {serverStatus && (
              <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap", flexShrink: 0 }}>
                {serverStatus.provider} · {serverStatus.modelDisplay}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 0.5, flexWrap: "wrap" }}>
            {serverStatus ? (
              serverStatus.mcps.map(mcp => (
                <Box key={mcp.name} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Box
                    sx={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      flexShrink: 0,
                      background: mcp.connected ? "#48bb78" : "#cbd5e0",
                      boxShadow: mcp.connected ? "0 0 0 2px #c6f6d540" : "none",
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {mcp.name}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="caption" color="text.secondary">
                Connecting…
              </Typography>
            )}
          </Box>
        </Box>

        {/* Message list — full-width scroll area; each message controls its own width */}
        <Box sx={{ flex: 1, overflowY: "auto", py: 2 }}>
          {messages.map((msg, i) => (
            <MessageBubble
              key={i}
              message={msg}
              messageIndex={i}
              widgetHeights={widgetHeights}
              onHeightChange={handleHeightChange}
            />
          ))}

          {loading && (
            <Box sx={{ maxWidth: CHAT_MAX_WIDTH, mx: "auto", px: 2, width: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <CircularProgress size={16} />
                <Typography variant="caption" color="text.secondary">
                  Thinking…
                </Typography>
              </Box>
            </Box>
          )}

          <div ref={bottomRef} />
        </Box>

        {/* Input bar — chat column width */}
        <Box
          sx={{
            maxWidth: CHAT_MAX_WIDTH,
            mx: "auto",
            px: 2,
            width: "100%",
            py: 2,
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            gap: 1,
            alignItems: "flex-end",
          }}
        >
          <TextField
            fullWidth
            multiline
            maxRows={4}
            size="small"
            placeholder="Ask a question or paste a credible set study locus ID…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <IconButton
            color="primary"
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            sx={{ mb: "2px" }}
            aria-label="Send message"
            type="button"
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </IconButton>
        </Box>
      </Box>
    </>
  );
}

export default ChatDemoPage;
