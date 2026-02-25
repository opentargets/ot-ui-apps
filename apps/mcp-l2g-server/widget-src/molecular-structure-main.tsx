import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@modelcontextprotocol/ext-apps";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import MolecularStructureWidget from "./MolecularStructureWidget";

const emotionCache = createCache({
  key: "ot-ms",
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

const app = new App(
  { name: "ot-molecular-structure-widget", version: "0.1.0" },
  {},
  { autoResize: false }
);

function Root() {
  const [variantId, setVariantId] = useState<string | null>(null);

  React.useEffect(() => {
    let observer: ResizeObserver | null = null;

    async function connect() {
      try {
        await app.connect();

        const sendHeight = () => {
          const h = Math.max(document.documentElement.scrollHeight, 50);
          app.sendSizeChanged({ height: h }).catch(() => {});
        };

        observer = new ResizeObserver(sendHeight);
        observer.observe(document.documentElement);
        sendHeight();

        app.ontoolinput = ({ arguments: args }) => {
          const id = args?.variantId;
          if (typeof id === "string") setVariantId(id);
        };
      } catch (err) {
        console.error("[MS widget] AppBridge connect failed:", err);
      }
    }

    connect();
    return () => {
      observer?.disconnect();
    };
  }, []);

  if (!variantId) {
    return (
      <div style={{ padding: "24px", color: "#718096", fontFamily: "sans-serif" }}>
        Connecting…
      </div>
    );
  }

  return <MolecularStructureWidget variantId={variantId} />;
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
