import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type Anthropic from "@anthropic-ai/sdk";

const OTP_MCP_URL =
  process.env.OTP_MCP_URL ?? "https://mcp.platform.opentargets.org/mcp";
const OTP_RETRY_COOLDOWN_MS = 30_000;

let otpClient: Client | null = null;
let otpLastAttempt = 0;

/** Anthropic-format tool definitions fetched from the OTP MCP server. Updated on connect. */
export let otpAnthropicTools: Anthropic.Tool[] = [];

/** Returns true if the OTP MCP client is currently connected. */
export function isOtpConnected(): boolean {
  return otpClient !== null;
}

/** Resets the client so the next request will attempt to reconnect. */
export function resetOtpClient(): void {
  otpClient = null;
  otpAnthropicTools = [];
}

async function initOtpClient(): Promise<void> {
  const client = new Client({ name: "ot-widgets-chat", version: "0.1.0" });
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

/**
 * Returns the OTP MCP client, initialising it lazily on first call.
 * If the previous attempt failed, waits OTP_RETRY_COOLDOWN_MS before retrying.
 */
export async function getOtpClient(): Promise<Client | null> {
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
