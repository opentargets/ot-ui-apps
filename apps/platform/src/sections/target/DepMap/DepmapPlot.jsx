import React from 'react';
import Plot from 'react-plotly.js';

function DepmapPlot({ data }) {
  console.log('test data new:', data);

  const trackHeight = 63.6;

  // plot data
  const depMapEssentiality = data.map(d => ({
    type: 'box',
    name: `${d.tissueName} (${d.screens.length})`,

    // dots/points settings:
    x: d.screens.map(s => s.geneEffect),
    hovertext: d.screens.map(
      s => `id:${s.diseaseCellLineId} exp:${s.expression}`
    ),
    jitter: .3,
    marker: {
      color: '#3589CA',
      size: d.screens.map(s => (s.expression + 1) * 2), //not working for boxplot
      opacity: 0.5,
      showscale: true,
    },

    // box settings:
    boxpoints: 'all',
    line: {
        color: 'rgba(0,0,0,0.4)',
        width: 1.5,
    },
    fillcolor: 'rgba(0,0,0,0)', // transparent fill

    // legend (facets) settings:
    legendgrouptitle: {
      text: 'legend title',
    },
    showlegend: true,
    
    // opacity: 0.2,
    hovertext: d.screens.map(s => `<b>${s.cellLineName}</b><br />Disease: ${s.diseaseFromSource}<br />Gene Effect: ${s.geneEffect}<br />Expression: ${s.expression}`),
    hoverinfo: 'text',
  }));

  // plot layout options
  const layoutOptions = {
    width: 1000, //window.innerWidth,
    height: (data.length * trackHeight) + 180, // plotly adds 180px at the bottom after tracks
    title: 'DepMapEssentiality',
    autosize: true,
    yaxis: {
      automargin: 'width',
    },
    shapes: [
      {
        // draw the reference line at -1
        type: 'line',
        x0: -1,
        y0: -0.5,
        x1: -1,
        y1: depMapEssentiality.length - 0.5,
        line: {
          color: '#rgba(255,0,0,.5)',
          width: 1,
          dash: `0px, ${trackHeight*.1}px, ${trackHeight*.8}px, ${trackHeight*.1}px`,
        },
      },
    ],
    legend: {
      bgcolor: '#f5f5f5',
      entrywidth: 300,
    },
    boxgap: 0.5,
    font: {
      family: "Inter",
    },
  }

  return (
    <Plot
      data={depMapEssentiality}
      layout={layoutOptions}
    />
  );
}


export default DepmapPlot;
