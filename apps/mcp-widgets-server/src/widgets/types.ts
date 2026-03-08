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
  /**
   * Multi-param variant of inputParam — canonical for section widgets and evidence tools.
   * When present, all entries are registered as MCP tool input schema fields.
   */
  inputParams?: Array<{ name: string; description: string }>;
  /** URI prefix for the MCP resource, e.g. "ui://ot-mcp/l2g" */
  uriPrefix: string;
  /** Filename of the IIFE bundle served from /widgets/, e.g. "l2g.js" */
  bundleFile: string;
  /** <title> text shown in the iframe document */
  title: string;
  /** Message returned to Claude after the widget renders */
  successMessage: string;
  /**
   * When defined, the tool handler fetches this GraphQL query server-side and
   * injects the result via a window.fetch interceptor in the widget HTML.
   * This is required for Claude Desktop where the sandboxed iframe cannot make
   * external network requests.
   */
  prefetch?: {
    /** Full GraphQL query string (must include the operationName) */
    query: string;
    /** Apollo operationName — must match the name in the query string */
    operationName: string;
    /** Extra static variables merged alongside the main inputParam (e.g. pagination) */
    extraVariables?: Record<string, unknown>;
    /**
     * Additional queries to run after the primary query.
     * Variables can depend on the primary query's result (e.g. diseaseIds from studyId).
     */
    extraPrefetches?: Array<{
      query: string;
      operationName: string;
      /** Compute variables from the raw input value and the primary query's data */
      variables: (inputValue: string, primaryData: unknown) => Record<string, unknown>;
      /**
       * When set, the cached data for this operation is an array of items.
       * The interceptor filters by matching item[itemIdField] against the
       * widget's actual request variable[requestVarName], then returns
       * { [responseKey]: filteredItems }.
       * Used for on-demand detail queries (e.g. ClinicalRecordsQuery).
       */
      filteredBy?: {
        requestVarName: string;
        itemIdField: string;
        responseKey: string;
      };
    }>;
    /**
     * Optional: derive additional URLs to fetch server-side from the GraphQL data.
     * Results are injected into the HTML fetch interceptor by exact URL match.
     * Useful for binary/text assets (e.g. AlphaFold CIF files) that would be
     * blocked from the sandboxed iframe.
     */
    extractExtraFetches?: (data: unknown) => Array<{ url: string; contentType: string }>;
  };
};

const PUBLIC_API_URL = "https://api.platform.opentargets.org/api/v4/graphql";

/**
 * Generates the HTML shell that loads the IIFE widget bundle inside the iframe.
 * All widgets share the same boilerplate — only the title and bundle URL differ.
 *
 * The GraphQL API URL is read from OT_API_URL at server startup and injected as
 * window.__OT_API_URL__ so the widget bundle can use it without a rebuild.
 */
export function makeWidgetShell(port: number, def: WidgetDef): string {
  const apiUrl = process.env.OT_API_URL ?? PUBLIC_API_URL;
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
    <script>window.__OT_API_URL__ = "${apiUrl}";</script>
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
