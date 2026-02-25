import { type KeyboardEvent, type ReactElement, useEffect, useRef, useState } from "react";
import { Box, CircularProgress, IconButton, Paper, TextField, Typography } from "@mui/material";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet";
import { NavBar } from "ui";
import { mainMenuItems } from "@ot/constants";
import { AppRenderer } from "@mcp-ui/client";

const CHAT_API_URL = "http://localhost:3001/chat";

const sandboxUrl = new URL("http://localhost:3001/sandbox_proxy.html");

type Widget = {
  toolName: string;
  toolInput: Record<string, unknown>;
  html: string;
};

type Message = {
  role: "user" | "assistant";
  text: string;
  widgets?: Widget[];
};

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  text: "Hi! I'm the Open Targets research assistant. I have access to the full Open Targets Platform — I can search targets, diseases, drugs, and variants, run GraphQL queries, and show interactive data widgets inline.\n\nTry asking:\n- **What diseases is BRCA1 associated with?**\n- **Search for drugs targeting PCSK9**\n- **Show me the L2G widget for 184646618bb06f7679ceaa7f5ef747f7**",
};

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
  return (
    <Paper
      variant="outlined"
      sx={{ mt: 1.5, overflow: "hidden", borderRadius: 2, borderColor: "#cbd5e0" }}
    >
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
        <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: "#48bb78" }} />
        <Typography variant="caption" color="text.secondary">
          MCP widget ·{" "}
          <code style={{ fontSize: 11 }}>
            {widget.toolName}(
            {Object.entries(widget.toolInput)
              .map(([k, v]) => `${k}: "${v}"`)
              .join(", ")}
            )
          </code>
        </Typography>
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
            if (h !== undefined && h > 0) {
              onHeightChange(widgetKey, Math.max(h, 200));
            }
          }}
          onError={err => console.error("MCP widget error:", err)}
        />
      </Box>
    </Paper>
  );
}

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

  // Render markdown-like bold + newlines (minimal)
  const renderText = (text: string) => {
    return text.split("\n").map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={j}>{part.slice(2, -2)}</strong>;
        }
        // Inline code
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
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        mb: 2,
      }}
    >
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

        {/* Inline widgets below the assistant bubble */}
        {message.widgets?.map((widget, wi) => {
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
  );
}

function ChatDemoPage(): ReactElement {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [widgetHeights, setWidgetHeights] = useState<Record<string, number>>({});
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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

      const assistantMessage: Message = {
        role: "assistant",
        text: data.text ?? "",
        widgets: data.widgets ?? [],
      };
      setMessages(prev => [...prev, assistantMessage]);
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

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 64px)",
          maxWidth: 860,
          mx: "auto",
          px: 2,
        }}
      >
        {/* Header */}
        <Box sx={{ py: 2, borderBottom: "1px solid #e2e8f0" }}>
          <Typography variant="h6" fontWeight={700}>
            Open Targets Research Assistant
          </Typography>
          <Typography variant="caption" color="text.secondary">
            AI chat with inline MCP data widgets
          </Typography>
        </Box>

        {/* Message list */}
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <CircularProgress size={16} />
              <Typography variant="caption" color="text.secondary">
                Thinking…
              </Typography>
            </Box>
          )}

          <div ref={bottomRef} />
        </Box>

        {/* Input bar */}
        <Box
          sx={{
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
