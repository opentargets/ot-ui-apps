import React from 'react';
import Plot from 'react-plotly.js';
import _ from 'lodash';

function DepmapPlot({ data }) {
  console.log('test data new:', data);

  const trackHeight = 60;

  const onPointClick = (evt) => {
    const { points } = evt;
    const id = points[0]?.id;
    if(id){
      const url = `https://depmap.org/portal/cell_line/${id}?tab=overview`;
      window.open(url, '_blank');
    }
  };

  // plot data
  const depMapEssentiality = data.map(d => ({
    type: 'box',
    tissueName: d.tissueName,
    name: `${_.capitalize(d.tissueName)} (${d.screens.length})`,

    // points data:
    x: d.screens.map(s => s.geneEffect),
    ids: d.screens.map(s => s.depmapId),

    // tooltip settings
    hoveron: "points",  // enable tooltip only for points, not boxes
    hovertext: d.screens.map(s => `<b>${s.cellLineName}</b><br />Disease: ${s.diseaseFromSource}<br />Gene Effect: ${s.geneEffect}<br />Expression: ${s.expression}`),
    hoverinfo: 'text',

    // points appearance
    jitter: .3,
    pointpos: 0,
    marker: {
      color: '#3589CA',
      size: 7, 
      opacity: 0.6,
    },

    // box settings:
    boxpoints: 'all',
    line: {
        color: 'rgba(0,0,0,0.4)',
        width: 1.5,
    },
    fillcolor: 'rgba(0,0,0,0)', // transparent fill

    // legend (facets) settings:
    // legendgrouptitle: {
    //   text: '',
    // },
    showlegend: true,
  }));

  // plot layout options
  const layoutOptions = {
    width: 1000, //window.innerWidth,
    height: (data.length * trackHeight) + 180, // plotly adds 180px at the bottom after tracks
    title: '',
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
      family: 'Inter',
    },
  }

  return (
    <Plot
      data={depMapEssentiality}
      layout={layoutOptions}
      onClick={onPointClick}
    />
  );
}


export default DepmapPlot;
