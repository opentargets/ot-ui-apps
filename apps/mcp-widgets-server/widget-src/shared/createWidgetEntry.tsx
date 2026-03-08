/**
 * Factory that wires up the AppBridge connection, ResizeObserver height
 * reporting, Emotion cache, and MUI theme for a widget IIFE bundle.
 *
 * Each widget's entry point (e.g. widget-src/l2g/main.tsx) calls mountWidget()
 * with its specific component and argument-extraction logic — everything else
 * is handled here.
 *
 * autoResize: false — we report only HEIGHT manually so AppFrame never sets a
 * pixel width on the proxy iframe (which would collapse the layout to the
 * document's current pixel width and trigger a feedback loop).
 */
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@modelcontextprotocol/ext-apps";
import { ThemeProvider, CssBaseline } from "@mui/material";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { MemoryRouter } from "react-router-dom";
import { theme } from "./theme";

// __OT_API_URL__ is injected at build time by Vite's define (from OT_API_URL in .env).
// window.__OT_API_URL__ can override it at runtime (set by the HTML shell script).
declare const __OT_API_URL__: string;

const apolloClient = new ApolloClient({
  uri: (window as { __OT_API_URL__?: string }).__OT_API_URL__ ?? __OT_API_URL__,
  cache: new InMemoryCache(),
});

export interface WidgetEntryConfig<TArgs extends Record<string, unknown>> {
  /** MCP app name reported to the host, e.g. "ot-l2g-widget" */
  appName: string;
  /** Emotion cache key — must be unique per widget to avoid style conflicts */
  cacheKey: string;
  /** Extract typed args from the raw ontoolinput arguments object, or null if incomplete */
  extractArgs: (args: Record<string, unknown>) => TArgs | null;
  /** The widget React component to render once args are received */
  component: React.ComponentType<TArgs>;
}

export function mountWidget<TArgs extends Record<string, unknown>>(
  config: WidgetEntryConfig<TArgs>
): void {
  // Emotion cache + MUI theme are created at IIFE evaluation time so
  // document.head is available synchronously before any async React rendering.
  // speedy:false → text-node style injection instead of CSSStyleSheet.insertRule(),
  // which silently fails inside sandboxed/nested iframes.
  const emotionCache = createCache({
    key: config.cacheKey,
    container: document.head,
    speedy: false,
  });

  const app = new App({ name: config.appName, version: "0.1.0" }, {}, { autoResize: false });

  function Root() {
    const [args, setArgs] = useState<TArgs | null>(null);

    React.useEffect(() => {
      let observer: ResizeObserver | null = null;

      async function connect() {
        try {
          // Set handler BEFORE connect() so we never miss an early ontoolinput
          // event dispatched by the host during the handshake.
          app.ontoolinput = ({ arguments: rawArgs }) => {
            const extracted = config.extractArgs((rawArgs ?? {}) as Record<string, unknown>);
            if (extracted) setArgs(extracted);
          };

          await app.connect();

          const sendHeight = () => {
            const h = Math.max(document.documentElement.scrollHeight, 50);
            app.sendSizeChanged({ height: h }).catch(() => {});
          };

          observer = new ResizeObserver(sendHeight);
          observer.observe(document.documentElement);
          sendHeight();
        } catch (err) {
          console.error(`[${config.appName}] AppBridge connect failed:`, err);
        }
      }

      connect();
      return () => {
        observer?.disconnect();
      };
    }, []);

    if (!args) {
      return (
        <div style={{ padding: "24px", color: "#718096", fontFamily: "sans-serif" }}>
          Connecting…
        </div>
      );
    }

    const Widget = config.component;
    return (
      <ApolloProvider client={apolloClient}>
        <MemoryRouter>
          <Widget {...args} />
        </MemoryRouter>
      </ApolloProvider>
    );
  }

  const rootEl = document.getElementById("root");
  if (rootEl) {
    createRoot(rootEl).render(
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Root />
        </ThemeProvider>
      </CacheProvider>
    );
  }
}
