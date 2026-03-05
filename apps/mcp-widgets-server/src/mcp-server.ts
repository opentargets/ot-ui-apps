import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  registerAppTool,
  registerAppResource,
  RESOURCE_MIME_TYPE,
  RESOURCE_URI_META_KEY,
} from "@modelcontextprotocol/ext-apps/server";
import { z } from "zod";
import { readFile } from "node:fs/promises";
import { WIDGET_REGISTRY } from "./widgets/index.js";

const PUBLIC_API_URL = "https://api.platform.opentargets.org/api/v4/graphql";

/** Builds a self-contained HTML string with the widget IIFE bundle inlined.
 *  Inlining is required for MCP App hosts (Claude, Cursor) whose sandboxed
 *  iframe CSP blocks external <script src> tags. */
async function makeInlinedWidgetShell(bundleFile: string, title: string): Promise<string> {
  const bundlePath = new URL(`../dist/widgets/${bundleFile}`, import.meta.url).pathname;
  const bundleJs = await readFile(bundlePath, "utf-8");
  const apiUrl = process.env.OT_API_URL ?? PUBLIC_API_URL;
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      html, body { min-height: 100%; height: auto; }
      #root { min-height: 100%; }
    </style>
    <script>window.__OT_API_URL__ = "${apiUrl}";</script>
  </head>
  <body>
    <div id="root"></div>
    <script>${bundleJs}</script>
  </body>
</html>`;
}

export function createMcpServer(_port: number): McpServer {
  const server = new McpServer({ name: "ot-widgets-server", version: "0.1.0" });

  for (const def of WIDGET_REGISTRY) {
    const resourceUri = `ui://ot-widgets/${def.toolName}`;

    // Cast the input schema — TypeScript cannot infer generics from a computed key.
    const inputSchema = {
      [def.inputParam.name]: z.string().describe(def.inputParam.description),
    } as Parameters<typeof registerAppTool>[2]["inputSchema"];

    registerAppTool(
      server,
      def.toolName,
      {
        description: def.description,
        inputSchema,
        _meta: { ui: { resourceUri } },
      },
      async input => {
        console.log(`[mcp] tool called: ${def.toolName}`, input);
        console.log(`[mcp] returning _meta.resourceUri: ${resourceUri}`);
        return {
          content: [{ type: "text" as const, text: def.successMessage }],
          _meta: { [RESOURCE_URI_META_KEY]: resourceUri },
        };
      }
    );

    registerAppResource(server, def.title, resourceUri, { mimeType: RESOURCE_MIME_TYPE }, async () => {
      // DEBUG: return minimal HTML to isolate whether the iframe renders at all.
      // Remove this block and restore the try/catch below once rendering is confirmed.
      if (process.env.MCP_DEBUG_HTML === "1") {
        const debugHtml = `<!doctype html><html><body style="font-family:sans-serif;padding:20px">
<h2 style="color:#3489ca">✅ ${def.title}</h2>
<p>Resource URI: <code>${resourceUri}</code></p>
<p id="js-status" style="color:red">❌ JS not running</p>
<script type="module">
  document.getElementById('js-status').textContent = '✅ JS (module) running';
  document.getElementById('js-status').style.color = 'green';
  console.log('[OT Debug] module script executed for ${def.toolName}');
</script>
<script>
  document.body.innerHTML += '<p id="classic" style="color:orange">✅ Classic JS running</p>';
  console.log('[OT Debug] classic script executed for ${def.toolName}');
</script>
</body></html>`;
        console.log(`[mcp] resource READ (DEBUG): ${resourceUri}`);
        return { contents: [{ uri: resourceUri, mimeType: RESOURCE_MIME_TYPE, text: debugHtml }] };
      }

      try {
        const inlinedHtml = await makeInlinedWidgetShell(def.bundleFile, def.title);
        console.log(`[mcp] resource READ: ${resourceUri} (inlined html length: ${inlinedHtml.length})`);
        return { contents: [{ uri: resourceUri, mimeType: RESOURCE_MIME_TYPE, text: inlinedHtml }] };
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`[mcp] resource READ failed for ${resourceUri}: ${msg}`);
        console.error(`[mcp] hint: run "yarn build:widgets" in apps/mcp-widgets-server to build the bundles`);
        throw err;
      }
    });
  }

  return server;
}
