/**
 * Stdio transport entry point — exposes all widget tools over stdin/stdout.
 * Useful for connecting Claude Desktop or other MCP clients directly.
 *
 * The widget bundles are still served by the running HTTP server (yarn dev),
 * so this entry point requires the HTTP server to be running in parallel.
 */
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createMcpServer } from "./mcp-server.js";

const PORT = 3001;
const transport = new StdioServerTransport();
await createMcpServer(PORT).connect(transport);
