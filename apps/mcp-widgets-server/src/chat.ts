import type { Express } from "express";
import Anthropic from "@anthropic-ai/sdk";
import { WIDGET_REGISTRY, makeWidgetShell, toAnthropicTool } from "./widgets/index.js";
import { getOtpClient, otpAnthropicTools, resetOtpClient } from "./otp-client.js";

export const MODEL_ID = "claude-haiku-4-5-20251001";
export const MODEL_DISPLAY = "Claude Haiku 4.5";

const STUDY_LOCUS_RE = /\b([0-9a-f]{32})\b/i;

// Build the system prompt from the registry so it stays in sync automatically.
const WIDGET_TOOL_LIST = WIDGET_REGISTRY.map(
  (def, i) => `(${i + 1}) ${def.toolName} — ${def.description}`
).join(" ");

const SYSTEM_PROMPT =
  "You are an Open Targets research assistant with access to the full Open Targets Platform. " +
  "You can search for targets, diseases, drugs, variants, and studies, and execute GraphQL queries " +
  "to fetch live data from the platform. " +
  "You have interactive widget tools for rendering visualisations inline: " +
  WIDGET_TOOL_LIST +
  " For all other Open Targets data questions, use the search or query tools to fetch live data. " +
  "Be concise and scientific in your answers.";

type ChatMessage = { role: "user" | "assistant"; content: string };
type Widget = { toolName: string; toolInput: Record<string, unknown>; html: string };

type DebugToolCall = {
  name: string;
  input: Record<string, unknown>;
  result: string;
  isError: boolean;
};
type DebugStep = {
  toolCalls: DebugToolCall[];
  usage: { input_tokens: number; output_tokens: number };
};
export type DebugInfo = {
  steps: DebugStep[];
  totalUsage: { input_tokens: number; output_tokens: number };
  iterations: number;
  model: string;
};

const widgetByName = new Map(WIDGET_REGISTRY.map(w => [w.toolName, w]));

export function registerChatRoute(app: Express, port: number): void {
  app.post("/chat", async (req, res) => {
    const messages: ChatMessage[] = req.body?.messages ?? [];

    if (!process.env.ANTHROPIC_API_KEY) {
      // Mock mode — regex detect study locus ID and return an L2G widget.
      const lastUserMsg = [...messages].reverse().find(m => m.role === "user")?.content ?? "";
      const match = STUDY_LOCUS_RE.exec(lastUserMsg);
      if (match) {
        const studyLocusId = match[1];
        const def = widgetByName.get("get_l2g_widget")!;
        res.json({
          text: `Here's the interactive L2G widget for \`${studyLocusId}\`:`,
          widgets: [{ toolName: def.toolName, toolInput: { studyLocusId }, html: makeWidgetShell(port, def) }],
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

    // Attempt OTP connection so its tools are available in allTools below.
    const otp = await getOtpClient();
    const allTools: Anthropic.Tool[] = [
      ...WIDGET_REGISTRY.map(toAnthropicTool),
      ...otpAnthropicTools,
    ];

    const conversationMessages: Anthropic.MessageParam[] = messages.map(m => ({
      role: m.role,
      content: m.content,
    }));

    const widgets: Widget[] = [];
    let text = "";
    const debugSteps: DebugStep[] = [];
    const totalUsage = { input_tokens: 0, output_tokens: 0 };

    try {
      // Agentic loop — keep calling Claude until it stops requesting tools.
      while (true) {
        const response = await claude.messages.create({
          model: MODEL_ID,
          max_tokens: 4096,
          system: SYSTEM_PROMPT,
          tools: allTools,
          messages: conversationMessages,
        });

        totalUsage.input_tokens += response.usage.input_tokens;
        totalUsage.output_tokens += response.usage.output_tokens;

        for (const block of response.content) {
          if (block.type === "text") text += block.text;
        }

        if (response.stop_reason !== "tool_use") break;

        // Add assistant turn to conversation history.
        conversationMessages.push({ role: "assistant", content: response.content });

        const toolResults: Anthropic.ToolResultBlockParam[] = [];
        const stepToolCalls: DebugToolCall[] = [];

        for (const block of response.content) {
          if (block.type !== "tool_use") continue;

          const widgetDef = widgetByName.get(block.name);
          if (widgetDef) {
            // Widget tool — render the HTML shell and report success to Claude.
            const input = block.input as Record<string, string>;
            widgets.push({ toolName: block.name, toolInput: input, html: makeWidgetShell(port, widgetDef) });
            toolResults.push({ type: "tool_result", tool_use_id: block.id, content: widgetDef.successMessage });
            stepToolCalls.push({ name: block.name, input: block.input as Record<string, unknown>, result: widgetDef.successMessage, isError: false });
          } else if (otp) {
            // OTP platform tool — proxy the call to the upstream MCP server.
            try {
              const result = await otp.callTool({
                name: block.name,
                arguments: block.input as Record<string, unknown>,
              });
              const content = result.content
                .map(c => (c.type === "text" ? c.text : JSON.stringify(c)))
                .join("\n");
              toolResults.push({ type: "tool_result", tool_use_id: block.id, content });
              stepToolCalls.push({ name: block.name, input: block.input as Record<string, unknown>, result: content.slice(0, 600), isError: false });
            } catch (toolErr) {
              // Reset so the next request will attempt to reconnect.
              resetOtpClient();
              const msg = toolErr instanceof Error ? toolErr.message : "Tool call failed";
              const errContent = `Error calling ${block.name}: ${msg}`;
              toolResults.push({ type: "tool_result", tool_use_id: block.id, content: errContent, is_error: true });
              stepToolCalls.push({ name: block.name, input: block.input as Record<string, unknown>, result: errContent, isError: true });
            }
          } else {
            const errContent = "Open Targets Platform MCP is currently unavailable.";
            toolResults.push({ type: "tool_result", tool_use_id: block.id, content: errContent, is_error: true });
            stepToolCalls.push({ name: block.name, input: block.input as Record<string, unknown>, result: errContent, isError: true });
          }
        }

        debugSteps.push({
          toolCalls: stepToolCalls,
          usage: { input_tokens: response.usage.input_tokens, output_tokens: response.usage.output_tokens },
        });

        conversationMessages.push({ role: "user", content: toolResults });
      }

      const debug: DebugInfo = { steps: debugSteps, totalUsage, iterations: debugSteps.length, model: MODEL_ID };
      res.json({ text, widgets, debug });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      res.status(500).json({ error: message });
    }
  });
}
