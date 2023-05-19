import React, { Component } from 'react';
import Plot from 'react-plotly.js';

class PlotlyTest extends Component {
    render(){
        const { data } = this.props;
        console.log('test data:', data);
        // const trace1 = {
        //     x: [0.75, 5.25, 5.5, 6, 6.2, 6.6, 6.80, 7.0, 7.2, 7.5, 7.5, 7.75, 8.15, 8.15, 8.65, 8.93, 9.2, 9.5, 10, 10.25, 11.5, 12, 16, 20.90, 22.3, 23.25],
        //     type: 'box',
        //     name: 'All Points',
        //     jitter: 0.3,
        //     pointpos: -1.8,
        //     marker: {
        //       color: 'rgb(7,40,89)'
        //     },
        //     boxpoints: 'all'
        //   };

        const depMapEssentiality = data.map(d => ({
            x: d.screens.map(s => s.geneEffect),
            hovertext: d.screens.map(s => `id:${s.diseaseCellLineId} exp:${s.expression}`),
            type: 'box',
            name: d.tissueName,
            // jitter: 0.3,
            // pointpos: -1.8,
            marker: {
              color: '#3589CA',
              size: d.screens.map(s => (s.expression+1)*20),
              opacity: 0.5,
              showscale: true,
            },
            boxpoints: 'all'
        }));

        return (
            <Plot
            data = {depMapEssentiality}
            // data={[
                // trace1,
            // {
            //     x: [1, 2, 3],
            //     y: [2, 6, 3],
            //     type: 'scatter',
            //     mode: 'lines+markers',
            //     marker: {color: 'red'},
            // },
            // {type: 'bar', x: [1, 2, 3], y: [2, 5, 3]},
            // ]}
            layout={ {
                width: 1000, 
                height: 1400, 
                title: 'depMapEssentiality',
                facet_col: [],
                // annotations: data.map(d => ({
                //     text: 'alse',
                // })),
            } }
        />
        );
    }
}
export default PlotlyTest;