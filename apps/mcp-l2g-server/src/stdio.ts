import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createUIResource } from "@mcp-ui/server";
import { z } from "zod";

const PORT = 3001;

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

// MCP server over stdio — widget bundle is served by the dev server (yarn dev:mcp-l2g-server)
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

const transport = new StdioServerTransport();
await server.connect(transport);
