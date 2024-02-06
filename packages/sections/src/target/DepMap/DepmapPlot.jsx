import Plotly from "plotly.js-cartesian-dist-min";
import createPlotlyComponent from "react-plotly.js/factory";
import _ from "lodash";
import { useLayoutEffect, useRef, useState } from "react";

function DepmapPlot({ data }) {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);
  const Plot = createPlotlyComponent(Plotly);

  useLayoutEffect(() => {
    setWidth(ref.current.offsetWidth);
  }, []);

  const trackHeight = 40;

  const onPointClick = evt => {
    const { points } = evt;
    const id = points[0]?.id;
    if (id) {
      const url = `https://depmap.org/portal/cell_line/${id}?tab=overview`;
      window.open(url, "_blank");
    }
  };

  // plot data
  const depMapEssentiality = data
    .map(d => ({
      type: "box",
      tissueName: d.tissueName,
      name: `${_.capitalize(d.tissueName)} (${d.screens.length})`,

      // points data:
      x: d.screens.map(s => s.geneEffect),
      ids: d.screens.map(s => s.depmapId),

      // tooltip settings
      hoveron: "points", // enable tooltip only for points, not boxes
      hovertext: d.screens.map(
        s =>
          `<b>${s.cellLineName}</b><br />Disease: ${s.diseaseFromSource}<br />Gene Effect: ${s.geneEffect}<br />Expression: ${s.expression}`
      ),
      hoverinfo: "text",

      // points appearance
      jitter: 0.3,
      pointpos: 0,
      marker: {
        color: "#3589CA",
        size: 7,
        opacity: 0.6,
      },

      // box settings:
      boxpoints: "all",
      line: {
        color: "rgba(0,0,0,0.4)",
        width: 1.5,
      },
      fillcolor: "rgba(0,0,0,0)", // transparent fill

      // legend settings
      showlegend: false,
    }))
    // sort in reverse alphabetical order so it displays from top to bottom
    .sort((a, b) => {
      if (a.tissueName.toUpperCase() < b.tissueName.toUpperCase()) {
        return 1;
      }
      if (a.tissueName.toUpperCase() > b.tissueName.toUpperCase()) {
        return -1;
      }
      return 0;
    });

  // plot layout options
  const layoutOptions = {
    width: width,
    height: data.length * trackHeight + trackHeight * 3, // plotly adds roghly this space at the bottom after tracks
    title: "",
    autosize: true,
    xaxis: {
      title: "Gene Effect",
      zerolinecolor: "#DDD",
    },
    yaxis: {
      automargin: "width",
    },
    shapes: [
      {
        // draw the reference line at -1
        type: "line",
        x0: -1,
        y0: -0.5,
        x1: -1,
        y1: depMapEssentiality.length - 0.5,
        line: {
          color: "#rgba(255,0,0,.9)",
          width: 1,
          dash: "dot",
        },
      },
    ],
    margin: {
      t: 30,
    },
    boxgap: 0.5,
    font: {
      family: "Inter",
    },
  };

  return (
    <div ref={ref}>
      <Plot data={depMapEssentiality} layout={layoutOptions} onClick={onPointClick} />
    </div>
  );
}

export default DepmapPlot;
