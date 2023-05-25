import React from 'react';
import Plot from 'react-plotly.js';

function DepmapPlot({ data }) {
  console.log('test data new:', data);

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
    fillcolor: 'rgba(0,0,0,0)',

    // legend (facets) settings:
    legendgrouptitle: {
      text: 'legend title',
    },
    showlegend: true,
    
    // opacity: 0.2,
  }));

  // plot layout options
  const layoutOptions = {
    width: 1000, //window.innerWidth,
    height: 28 * 50,
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
          width: 1.5,
          dash: '40px,4px',
        },
      },
    ],
    legend: {
      bgcolor: '#0f0',
      entrywidth: 300,
    },
    boxgap: 0.4,
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
