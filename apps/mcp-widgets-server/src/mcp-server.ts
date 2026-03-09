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
 *
 *  Data delivery mechanism (AppBridge postMessage):
 *  ─────────────────────────────────────────────────
 *  Claude Desktop caches the resource HTML after the first read and never
 *  reloads it for subsequent tool calls. So we cannot embed data in the HTML
 *  at build-time for each call.
 *
 *  Instead, the HTML installs a dynamic window.fetch interceptor that BLOCKS
 *  all GraphQL requests until data arrives, then a postMessage listener that
 *  receives the data from the host via the AppBridge "ui/notifications/tool-result"
 *  event.  Every time the tool is called, the host fires this notification with
 *  the prefetched data attached to _meta.prefetchedData.  The interceptor then
 *  unblocks the pending Apollo requests with the correct data.
 *
 *  The "ui/notifications/tool-input" event fires first (before Apollo queries
 *  start) and is used to clear the stale cache from the previous call.
 */
async function makeWidgetShell(bundleFile: string, title: string): Promise<string> {
  const bundlePath = new URL(`../dist/widgets/${bundleFile}`, import.meta.url).pathname;
  const bundleJs = await readFile(bundlePath, "utf-8");
  const apiUrl = process.env.OT_API_URL ?? PUBLIC_API_URL;

  const dynamicInterceptor = `<script>
(function() {
  var __gql = {};
  var __urls = [];
  var __gqlPending = {};
  var __urlPending = {};
  // filteredOps: operations whose cached data must be filtered by request variables
  // { [operationName]: { allItems, itemIdField, requestVarName, responseKey } }
  var __filteredOps = {};

  function setData(gql, urlData, filteredOps) {
    __urls = urlData || [];
    // Resolve any pending URL fetches
    for (var i = 0; i < __urls.length; i++) {
      var entry = __urls[i];
      var urlQ = __urlPending[entry.url];
      if (urlQ) { for (var j = 0; j < urlQ.length; j++) urlQ[j](entry); delete __urlPending[entry.url]; }
    }
    // Register filtered ops (variable-aware, resolved on each request)
    filteredOps = filteredOps || [];
    for (var fi = 0; fi < filteredOps.length; fi++) {
      __filteredOps[filteredOps[fi].operationName] = filteredOps[fi];
    }
    // Resolve pending GraphQL fetches
    for (var op in gql) {
      __gql[op] = gql[op];
      var q = __gqlPending[op];
      if (q) { for (var k = 0; k < q.length; k++) q[k](gql[op]); delete __gqlPending[op]; }
    }
  }

  // Listen for AppBridge postMessages from the host
  window.addEventListener("message", function(e) {
    try {
      var msg = e.data;
      if (!msg) return;
      // Clear stale data before new tool input arrives (before Apollo queries run)
      if (msg.method === "ui/notifications/tool-input") {
        __gql = {}; __urls = []; __filteredOps = {};
        return;
      }
      // Receive prefetched data from the tool result
      if (msg.method === "ui/notifications/tool-result") {
        var p = msg.params || {};
        var pf = (p._meta && p._meta.prefetchedData) || null;
        if (pf) {
          var gql = {};
          // New format: operations array
          if (pf.operations) {
            for (var oi = 0; oi < pf.operations.length; oi++) {
              var oop = pf.operations[oi];
              if (oop && oop.operationName !== undefined) gql[oop.operationName] = oop.data;
            }
          }
          // Legacy format: single operationName/data
          if (pf.operationName && pf.data !== undefined) gql[pf.operationName] = pf.data;
          setData(gql, pf.urlData || [], pf.filteredOps || []);
        }
      }
    } catch(_) {}
  });

  // Intercept fetch — block GraphQL until data arrives, serve URLs from cache
  var _fetch = window.fetch.bind(window);
  window.fetch = function(url, opts) {
    try {
      if (opts && opts.method === "POST" && opts.body) {
        var body = JSON.parse(opts.body);
        if (body.operationName) {
          var op = body.operationName;
          // Filtered op: return only items matching the request's variable list
          if (__filteredOps[op]) {
            var fo = __filteredOps[op];
            var vars = body.variables || {};
            var reqIds = vars[fo.requestVarName] || [];
            var idSet = {};
            for (var ri = 0; ri < reqIds.length; ri++) idSet[reqIds[ri]] = true;
            var filtered = [];
            for (var ai = 0; ai < fo.allItems.length; ai++) {
              if (idSet[fo.allItems[ai][fo.itemIdField]]) filtered.push(fo.allItems[ai]);
            }
            var respData = {};
            respData[fo.responseKey] = filtered;
            return Promise.resolve(new Response(
              JSON.stringify({ data: respData }),
              { status: 200, headers: { "Content-Type": "application/json" } }
            ));
          }
          if (__gql[op] !== undefined) {
            return Promise.resolve(new Response(
              JSON.stringify({ data: __gql[op] }),
              { status: 200, headers: { "Content-Type": "application/json" } }
            ));
          }
          return new Promise(function(resolve, reject) {
            if (!__gqlPending[op]) __gqlPending[op] = [];
            __gqlPending[op].push(function(data) {
              resolve(new Response(JSON.stringify({ data: data }), { status: 200, headers: { "Content-Type": "application/json" } }));
            });
            setTimeout(function() { reject(new Error("OT data timeout for " + op)); }, 30000);
          });
        }
      }
    } catch(_) {}
    // URL cache (e.g. AlphaFold CIF files fetched server-side)
    for (var i = 0; i < __urls.length; i++) {
      if (url === __urls[i].url) {
        return Promise.resolve(new Response(__urls[i].text, { status: 200, headers: { "Content-Type": __urls[i].contentType } }));
      }
    }
    return _fetch(url, opts);
  };
})();
</script>`;

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
    <script>window.__OT_API_URL__ = "${apiUrl}"; window.configProfile = { isPartnerPreview: false, partnerTargetSectionIds: [], partnerDiseaseSectionIds: [], partnerDrugSectionIds: [], partnerEvidenceSectionIds: [], partnerDataTypes: [], partnerDataSources: [] };</script>
    ${dynamicInterceptor}
  </head>
  <body>
    <div id="root"></div>
    <script>${bundleJs}</script>
  </body>
</html>`;
}

type PrefetchResult = {
  operations: Array<{ operationName: string; data: unknown }>;
  /** Variable-filtered operations: interceptor filters allItems by request variables at call time */
  filteredOps?: Array<{
    operationName: string;
    allItems: unknown[];
    itemIdField: string;
    requestVarName: string;
    responseKey: string;
  }>;
  urlData?: Array<{ url: string; text: string; contentType: string }>;
};

/** Runs a single GraphQL request against the OT API. */
async function gqlFetch(
  apiUrl: string,
  operationName: string,
  query: string,
  variables: Record<string, unknown>
): Promise<unknown> {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ operationName, query, variables }),
  });
  const json = (await response.json()) as { data?: unknown };
  return json.data;
}

/** Fetches GraphQL data server-side for widgets that define prefetch config. */
async function fetchPrefetchData(
  def: {
    prefetch: NonNullable<(typeof import("./widgets/index.js").WIDGET_REGISTRY)[number]["prefetch"]>;
    inputParam: { name: string };
    inputParams?: Array<{ name: string }>;
  },
  inputValues: Record<string, string>
): Promise<PrefetchResult | null> {
  const apiUrl = process.env.GRAPHQL_API_URL ?? process.env.OT_API_URL ?? PUBLIC_API_URL;
  try {
    const primaryVariables = {
      ...inputValues,
      ...(def.prefetch.extraVariables ?? {}),
    };
    const primaryData = await gqlFetch(
      apiUrl,
      def.prefetch.operationName,
      def.prefetch.query,
      primaryVariables
    );

    const operations: Array<{ operationName: string; data: unknown }> = [
      { operationName: def.prefetch.operationName, data: primaryData },
    ];

    const filteredOps: PrefetchResult["filteredOps"] = [];

    // Run extra queries in parallel (all depend only on primaryData, not each other)
    if (def.prefetch.extraPrefetches) {
      const firstInputValue = inputValues[def.inputParam.name] ?? Object.values(inputValues)[0] ?? "";
      await Promise.all(
        def.prefetch.extraPrefetches.map(async extra => {
          try {
            const extraData = await gqlFetch(
              apiUrl,
              extra.operationName,
              extra.query,
              extra.variables(firstInputValue, primaryData)
            );
            if (extra.filteredBy) {
              const fb = extra.filteredBy;
              const allItems = (extraData as any)?.[fb.responseKey] ?? [];
              filteredOps.push({
                operationName: extra.operationName,
                allItems,
                itemIdField: fb.itemIdField,
                requestVarName: fb.requestVarName,
                responseKey: fb.responseKey,
              });
            } else {
              operations.push({ operationName: extra.operationName, data: extraData });
            }
          } catch (err) {
            console.error(`[mcp] extra prefetch failed for ${extra.operationName}:`, err);
          }
        })
      );
    }

    // Fetch extra URL assets (e.g. AlphaFold CIF) derived from primary data
    let urlData: Array<{ url: string; text: string; contentType: string }> | undefined;
    if (def.prefetch.extractExtraFetches) {
      const extraFetches = def.prefetch.extractExtraFetches(primaryData);
      if (extraFetches.length > 0) {
        urlData = await Promise.all(
          extraFetches.map(async ({ url, contentType }) => {
            try {
              const r = await fetch(url);
              const text = await r.text();
              return { url, text, contentType };
            } catch (err) {
              console.error(`[mcp] extra fetch failed for ${url}:`, err);
              return { url, text: "", contentType };
            }
          })
        );
      }
    }

    return { operations, filteredOps: filteredOps.length > 0 ? filteredOps : undefined, urlData };
  } catch (err) {
    console.error(`[mcp] prefetch failed for ${def.prefetch.operationName}:`, err);
    return null;
  }
}

export function createMcpServer(_port: number): McpServer {
  const server = new McpServer({ name: "ot-widgets-server", version: "0.1.0" });

  for (const def of WIDGET_REGISTRY) {
    const resourceUri = `ui://ot-widgets/${def.toolName}`;

    const params = def.inputParams ?? [def.inputParam];
    const inputSchema = Object.fromEntries(
      params.map(p => [p.name, z.string().describe(p.description)])
    ) as Parameters<typeof registerAppTool>[2]["inputSchema"];

    registerAppTool(
      server,
      def.toolName,
      {
        description: def.description,
        inputSchema,
        _meta: { ui: { resourceUri } },
      },
      async input => {
        console.error(`[mcp] tool called: ${def.toolName}`, input);
        const inputValues = Object.fromEntries(
          params.map(p => [p.name, String(input[p.name as keyof typeof input] ?? "")])
        );

        let prefetched = null;
        if (def.prefetch) {
          prefetched = await fetchPrefetchData(
            def as Parameters<typeof fetchPrefetchData>[0],
            inputValues
          );
        }

        console.error(`[mcp] prefetch done for ${def.toolName}, returning result with data`);

        // Include prefetched data in _meta so Claude Desktop forwards it to the widget
        // via the "ui/notifications/tool-result" AppBridge postMessage.  The HTML's
        // dynamic fetch interceptor listens for this message and unblocks pending queries.
        return {
          content: [{ type: "text" as const, text: def.successMessage }],
          _meta: {
            [RESOURCE_URI_META_KEY]: resourceUri,
            prefetchedData: prefetched,
          },
        };
      }
    );

    // Resource handler — serves the HTML shell immediately (no blocking).
    // Data is not embedded here; it arrives via AppBridge tool-result postMessage.
    registerAppResource(server, def.title, resourceUri, { mimeType: RESOURCE_MIME_TYPE }, async () => {
      console.error(`[mcp] resource READ: ${resourceUri}`);
      const html = await makeWidgetShell(def.bundleFile, def.title);
      return { contents: [{ uri: resourceUri, mimeType: RESOURCE_MIME_TYPE, text: html }] };
    });
  }

  return server;
}
