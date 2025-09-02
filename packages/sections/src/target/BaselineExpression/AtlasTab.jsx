import { Suspense, lazy, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { ErrorBoundary } from "ui";

import { Box } from "@mui/material";

function AtlasTab({ ensgId, symbol }) {
  const heatmapRef = useRef();

  useEffect(() => {
    const iframe = heatmapRef.current;

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <link rel="stylesheet" type="text/css"
            href="https://www.ebi.ac.uk/gxa/resources/css/customized-bootstrap-3.3.5.css"/>
          <script language="JavaScript" type="text/javascript"
            src="https://www.ebi.ac.uk/gxa/resources/js-bundles/vendorCommons.bundle.js">
          </script>
          <script language="JavaScript" type="text/javascript"
            src="https://www.ebi.ac.uk/gxa/resources/js-bundles/expressionAtlasHeatmapHighcharts.bundle.js">
          </script>
          <style>
            body {
              font-family: sans-serif;
              color: #5a5f5f;
            }
          </style>
        </head>
        <body>
          <div id="heatmap-container"></div>
          <script>

            // function to give all links target="_top" attribute
            function updateLinkTargets(root = document) {
              root.querySelectorAll('a').forEach(link => {
                link.setAttribute('target', '_top');
              });
            }

            // apply to existing links
            updateLinkTargets();

            // apply to dynamically added links
            const observer = new MutationObserver(mutations => {
              for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                  // if a single link is added
                  if (node.nodeType === 1) {
                    if (node.tagName === 'A') {
                      node.setAttribute('target', '_top');
                    } else {
                      // if a container is added that may include <a> tags
                      updateLinkTargets(node);
                    }
                  }
                }
              }
            });

            observer.observe(document.body, {
              childList: true,
              subtree: true,
            });

            expressionAtlasHeatmapHighcharts.render({
              query: {
                species: "homo sapiens",
                gene: "${ensgId}",
                target: "heatmapContainer",
              },
              showAnatomogram: false,
              target: "heatmap-container",
            });
          </script>
        </body>
      </html>
    `);
    doc.close();
  }, [ensgId]);

  return (
    <iframe ref={heatmapRef} style={{ border: "none", width: "100%", height: "600px" }}></iframe>
  );
}

export default AtlasTab;
