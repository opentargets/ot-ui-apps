import express from "express";
import cors from "cors";
import { randomUUID } from "node:crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { createUIResource } from "@mcp-ui/server";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";

const PORT = 3001;
const OTP_MCP_URL = "https://mcp.platform.opentargets.org/mcp";

/**
 * HTML shell returned by the tool.
 *
 * The widget bundle (dist/widgets/l2g.js) is a self-contained IIFE that:
 *   1. Connects to the host via @modelcontextprotocol/ext-apps App class
 *   2. Waits for tool-input { studyLocusId } from AppRenderer
 *   3. Fetches L2G data from the OT GraphQL API
 *   4. Renders the heatmap using the platform's existing helper logic
 */
function widgetShell(): string {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>L2G Widget</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      /* height: auto lets body grow with its content so ResizeObserver
         can detect when HeatmapTable renders and the page grows tall. */
      html, body { min-height: 100%; height: auto; }
      #root { min-height: 100%; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script src="http://localhost:${PORT}/widgets/l2g.js"></script>
  </body>
</html>`;
}

function createServer(): McpServer {
  const server = new McpServer({ name: "ot-l2g-demo", version: "0.1.0" });

  server.tool(
    "get_l2g_widget",
    "Get the interactive Locus-to-Gene (L2G) heatmap widget for a credible set. " +
      "Returns a rich interactive visualisation showing gene prioritisation scores and " +
      "SHAP feature-group contributions.",
    { studyLocusId: z.string().describe("The study locus ID of the credible set") },
    async ({ studyLocusId }) => {
      const uiResource = createUIResource({
        uri: `ui://ot-mcp/l2g/${studyLocusId}`,
        content: { type: "rawHtml", htmlString: widgetShell() },
        encoding: "text",
      });
      return { content: [uiResource] };
    }
  );

  return server;
}

// ----- HTTP server -----

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    exposedHeaders: ["mcp-session-id"],
  })
);

const transports = new Map<string, StreamableHTTPServerTransport>();

app.post("/mcp", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  let transport = sessionId ? transports.get(sessionId) : undefined;

  if (!transport) {
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: sid => {
        transports.set(sid, transport!);
      },
    });
    transport.onclose = () => {
      if (transport?.sessionId) transports.delete(transport.sessionId);
    };
    await createServer().connect(transport);
  }

  await transport.handleRequest(req, res, req.body);
});

app.get("/mcp", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  const transport = sessionId ? transports.get(sessionId) : undefined;
  if (!transport) { res.status(404).json({ error: "Session not found" }); return; }
  await transport.handleRequest(req, res);
});

app.delete("/mcp", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  const transport = sessionId ? transports.get(sessionId) : undefined;
  if (!transport) { res.status(404).json({ error: "Session not found" }); return; }
  await transport.handleRequest(req, res);
});

// Serve the sandbox proxy on a different origin (port 3001 ≠ platform port 3000)
app.get("/sandbox_proxy.html", (_req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.sendFile("sandbox_proxy.html", {
    root: new URL("../../../apps/platform/public", import.meta.url).pathname,
  });
});

// Serve the built widget bundle
app.use(
  "/widgets",
  express.static(new URL("../dist/widgets", import.meta.url).pathname, {
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
    },
  })
);

app.get("/health", (_req, res) =>
  res.json({ status: "ok", server: "ot-l2g-demo", sessions: transports.size })
);

// ----- OTP MCP client (lazy-initialized with retry cooldown) -----

let otpClient: Client | null = null;
let otpAnthropicTools: Anthropic.Tool[] = [];
let otpLastAttempt = 0;
const OTP_RETRY_COOLDOWN_MS = 30_000;

async function initOtpClient(): Promise<void> {
  const client = new Client({ name: "ot-l2g-chat", version: "0.1.0" });
  const transport = new StreamableHTTPClientTransport(new URL(OTP_MCP_URL));
  await client.connect(transport);
  const { tools } = await client.listTools();
  otpAnthropicTools = tools.map(t => ({
    name: t.name,
    description: t.description ?? t.name,
    input_schema: t.inputSchema as Anthropic.Tool["input_schema"],
  }));
  otpClient = client;
  console.log(`[OTP MCP] Connected — ${tools.length} tools: ${tools.map(t => t.name).join(", ")}`);
}

async function getOtpClient(): Promise<Client | null> {
  if (otpClient) return otpClient;
  const now = Date.now();
  if (now - otpLastAttempt < OTP_RETRY_COOLDOWN_MS) return null;
  otpLastAttempt = now;
  try {
    await initOtpClient();
    return otpClient;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[OTP MCP] Connection failed (will retry in 30s): ${msg}`);
    return null;
  }
}

// ----- /chat endpoint -----

const STUDY_LOCUS_RE = /\b([0-9a-f]{32})\b/i;

const SYSTEM_PROMPT =
  "You are an Open Targets research assistant with access to the full Open Targets Platform. " +
  "You can search for targets, diseases, drugs, variants, and studies, and execute GraphQL queries " +
  "to fetch live data from the platform. " +
  "You can also display interactive L2G heatmap widgets for credible sets — when a user provides a " +
  "study locus ID (a 32-character hex string), call get_l2g_widget to render the widget inline. " +
  "For all other Open Targets data questions, use the search or query tools to fetch live data. " +
  "Be concise and scientific in your answers.";

const L2G_TOOL_DEFINITION: Anthropic.Tool = {
  name: "get_l2g_widget",
  description:
    "Get the interactive Locus-to-Gene (L2G) heatmap widget for a credible set. " +
    "Returns a rich interactive visualisation showing gene prioritisation scores and SHAP feature-group contributions.",
  input_schema: {
    type: "object",
    properties: {
      studyLocusId: {
        type: "string",
        description: "The study locus ID of the credible set",
      },
    },
    required: ["studyLocusId"],
  },
};

type ChatMessage = { role: "user" | "assistant"; content: string };
type Widget = { toolName: string; toolInput: Record<string, unknown>; html: string };

app.post("/chat", async (req, res) => {
  const messages: ChatMessage[] = req.body?.messages ?? [];

  if (!process.env.ANTHROPIC_API_KEY) {
    // Mock mode — regex detect study locus ID
    const lastUserMsg = [...messages].reverse().find(m => m.role === "user")?.content ?? "";
    const match = STUDY_LOCUS_RE.exec(lastUserMsg);
    if (match) {
      const studyLocusId = match[1];
      res.json({
        text: `Here's the interactive L2G widget for \`${studyLocusId}\`:`,
        widgets: [{ toolName: "get_l2g_widget", toolInput: { studyLocusId }, html: widgetShell() }],
      });
    } else {
      res.json({
        text:
          "Hi! I'm the Open Targets research assistant.\n\n" +
          "I can render interactive **Locus-to-Gene (L2G)** heatmap widgets directly in this chat.\n\n" +
          "Paste a 32-character credible set study locus ID and I'll display the widget inline.\n\n" +
          "Example ID: `184646618bb06f7679ceaa7f5ef747f7`",
        widgets: [],
      });
    }
    return;
  }

  const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const otp = await getOtpClient();
  const allTools: Anthropic.Tool[] = [L2G_TOOL_DEFINITION, ...otpAnthropicTools];

  const conversationMessages: Anthropic.MessageParam[] = messages.map(m => ({
    role: m.role,
    content: m.content,
  }));

  const widgets: Widget[] = [];
  let text = "";

  try {
    // Agentic loop — keep calling Claude until it stops requesting tools
    while (true) {
      const response = await claude.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        tools: allTools,
        messages: conversationMessages,
      });

      for (const block of response.content) {
        if (block.type === "text") text += block.text;
      }

      if (response.stop_reason !== "tool_use") break;

      // Add assistant turn to conversation history
      conversationMessages.push({ role: "assistant", content: response.content });

      // Execute each tool call and collect results
      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const block of response.content) {
        if (block.type !== "tool_use") continue;

        if (block.name === "get_l2g_widget") {
          const input = block.input as { studyLocusId: string };
          widgets.push({ toolName: block.name, toolInput: input, html: widgetShell() });
          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: "L2G widget rendered successfully in the chat interface.",
          });
        } else if (otp) {
          try {
            const result = await otp.callTool({
              name: block.name,
              arguments: block.input as Record<string, unknown>,
            });
            const content = result.content
              .map(c => (c.type === "text" ? c.text : JSON.stringify(c)))
              .join("\n");
            toolResults.push({ type: "tool_result", tool_use_id: block.id, content });
          } catch (toolErr) {
            // Reset client so next request reconnects
            otpClient = null;
            otpAnthropicTools = [];
            const msg = toolErr instanceof Error ? toolErr.message : "Tool call failed";
            toolResults.push({
              type: "tool_result",
              tool_use_id: block.id,
              content: `Error calling ${block.name}: ${msg}`,
              is_error: true,
            });
          }
        } else {
          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: "Open Targets Platform MCP is currently unavailable.",
            is_error: true,
          });
        }
      }

      conversationMessages.push({ role: "user", content: toolResults });
    }

    res.json({ text, widgets });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

app.listen(PORT, () => {
  console.log("\n🔬 Open Targets L2G MCP Server");
  console.log(`   Running on  http://localhost:${PORT}`);
  console.log(`   MCP endpoint: http://localhost:${PORT}/mcp`);
  console.log(`   Widget bundle: http://localhost:${PORT}/widgets/l2g.js`);
  console.log("   Tool: get_l2g_widget(studyLocusId)\n");
});
