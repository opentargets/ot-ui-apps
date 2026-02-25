import type Anthropic from "@anthropic-ai/sdk";

/**
 * Descriptor for a single MCP widget tool.
 *
 * This is the single source of truth for each widget — MCP server registration,
 * Anthropic SDK tool definitions, the HTML shell, and the /status endpoint all
 * derive their data from this type.
 */
export type WidgetDef = {
  /** MCP tool name, e.g. "get_l2g_widget" */
  toolName: string;
  /** Human-readable description shown to the LLM */
  description: string;
  /** The single string input this widget accepts */
  inputParam: { name: string; description: string };
  /** URI prefix for the MCP resource, e.g. "ui://ot-mcp/l2g" */
  uriPrefix: string;
  /** Filename of the IIFE bundle served from /widgets/, e.g. "l2g.js" */
  bundleFile: string;
  /** <title> text shown in the iframe document */
  title: string;
  /** Message returned to Claude after the widget renders */
  successMessage: string;
};

/**
 * Generates the HTML shell that loads the IIFE widget bundle inside the iframe.
 * All widgets share the same boilerplate — only the title and bundle URL differ.
 */
export function makeWidgetShell(port: number, def: WidgetDef): string {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${def.title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      /* height: auto lets body grow with its content so ResizeObserver
         can detect when the widget renders and the page grows tall. */
      html, body { min-height: 100%; height: auto; }
      #root { min-height: 100%; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script src="http://localhost:${port}/widgets/${def.bundleFile}"></script>
  </body>
</html>`;
}

/** Derives an Anthropic SDK tool definition from a WidgetDef — single source of truth. */
export function toAnthropicTool(def: WidgetDef): Anthropic.Tool {
  return {
    name: def.toolName,
    description: def.description,
    input_schema: {
      type: "object" as const,
      properties: {
        [def.inputParam.name]: {
          type: "string",
          description: def.inputParam.description,
        },
      },
      required: [def.inputParam.name],
    },
  };
}
