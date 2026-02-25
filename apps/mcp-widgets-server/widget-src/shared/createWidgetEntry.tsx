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
import { theme } from "./theme";

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
          await app.connect();

          // Report content height whenever the document grows.
          // scrollHeight captures the full content height even with body overflow.
          // We intentionally omit width so the iframe keeps its default 100% width.
          const sendHeight = () => {
            const h = Math.max(document.documentElement.scrollHeight, 50);
            app.sendSizeChanged({ height: h }).catch(() => {
              /* ignore errors after unmount */
            });
          };

          observer = new ResizeObserver(sendHeight);
          observer.observe(document.documentElement);
          sendHeight();

          app.ontoolinput = ({ arguments: rawArgs }) => {
            const extracted = config.extractArgs((rawArgs ?? {}) as Record<string, unknown>);
            if (extracted) setArgs(extracted);
          };
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
    return <Widget {...args} />;
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
