import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@modelcontextprotocol/ext-apps";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import L2GWidget from "./L2GWidget";

// ---------------------------------------------------------------------------
// Emotion cache + MUI theme are created here at IIFE evaluation time.
//
// This is the most reliable point to capture `document` and `document.head`:
// the <script> tag sits at the bottom of <body> so the HTML parser has already
// created <head>, and the script runs synchronously in the inner iframe's
// JavaScript context — before any async React rendering begins.
//
// speedy:false → text-node style injection instead of CSSStyleSheet.insertRule()
// which silently fails inside sandboxed/nested iframes.
// ---------------------------------------------------------------------------

const emotionCache = createCache({
  key: "ot-l2g",
  container: document.head,
  speedy: false,
});

const theme = createTheme({
  shape: { borderRadius: 0 },
  typography: { fontFamily: '"Inter", sans-serif' },
  palette: {
    primary: { main: "#3489ca" },
    secondary: { main: "#ff6350" },
    text: { primary: "#5A5F5F" },
  },
});

// ---------------------------------------------------------------------------
// AppBridge connection
//
// autoResize: false — we report only HEIGHT manually so AppFrame never sets a
// pixel width on the proxy iframe (which would collapse the layout to the
// document's current pixel width and trigger a feedback loop).
// ---------------------------------------------------------------------------

const app = new App({ name: "ot-l2g-widget", version: "0.1.0" }, {}, { autoResize: false });

function Root() {
  const [studyLocusId, setStudyLocusId] = useState<string | null>(null);

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
        sendHeight(); // immediate report on connect

        app.ontoolinput = ({ arguments: args }) => {
          const id = args?.studyLocusId;
          if (typeof id === "string") setStudyLocusId(id);
        };
      } catch (err) {
        console.error("[L2G widget] AppBridge connect failed:", err);
      }
    }

    connect();

    return () => {
      observer?.disconnect();
    };
  }, []);

  if (!studyLocusId) {
    return (
      <div style={{ padding: "24px", color: "#718096", fontFamily: "sans-serif" }}>
        Connecting…
      </div>
    );
  }

  return <L2GWidget studyLocusId={studyLocusId} />;
}

// ---------------------------------------------------------------------------
// Mount — CacheProvider + ThemeProvider wrap the entire tree from root so
// every styled component (including MUI internals in ThemeProvider itself)
// uses the single, correctly-initialised Emotion cache.
// ---------------------------------------------------------------------------

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
