import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createUIResource } from "@mcp-ui/server";
import { z } from "zod";
import { WIDGET_REGISTRY, makeWidgetShell } from "./widgets/index.js";

export function createMcpServer(port: number): McpServer {
  const server = new McpServer({ name: "ot-widgets-server", version: "0.1.0" });

  for (const def of WIDGET_REGISTRY) {
    // TypeScript cannot infer the generic from a computed key, so we cast the schema.
    const schema = {
      [def.inputParam.name]: z.string().describe(def.inputParam.description),
    } as Parameters<typeof server.tool>[2];

    server.tool(def.toolName, def.description, schema, async input => {
      const value = (input as Record<string, string>)[def.inputParam.name];
      const uiResource = createUIResource({
        uri: `${def.uriPrefix}/${value}`,
        content: { type: "rawHtml", htmlString: makeWidgetShell(port, def) },
        encoding: "text",
      });
      return { content: [uiResource] };
    });
  }

  return server;
}
