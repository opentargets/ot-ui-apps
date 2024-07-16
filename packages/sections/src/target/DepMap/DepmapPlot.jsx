import { useRef, useEffect } from "react";
import * as Plot from "@observablehq/plot";
import { useMeasure } from "@uidotdev/usehooks";
import { Box, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

const prepareData = (data = []) => {
  const flatData = data.reduce((accumulator, currentValue) => {
    currentValue.screens.forEach(dot => {
      accumulator.push({ ...dot, tissueName: currentValue.tissueName });
    });
    return accumulator;
  }, []);
  return flatData;
};

function Wrapper({ data }) {
  const [ref, { width }] = useMeasure();
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <div style={{ width: "95%" }} ref={ref}>
        <ChartControls />
        <DepmapPlot data={data} width={width} />
      </div>
    </Box>
  );
}

function ChartControls({ data }) {
  return (
    <Box
      sx={{
        border: 1,
        borderColor: grey[300],
        background: grey[100],
        borderRadius: 2,
        display: "flex",
        justifyContent: "space-between",
        py: 1,
        px: 2,
      }}
    >
      <Box>
        <Typography variant="controlHeader">Cancer DepMap</Typography>
      </Box>
      <Box>
        <Typography variant="controlHeader">Actions</Typography>
      </Box>
    </Box>
  );
}

function DepmapPlot({ data, width }) {
  const headerRef = useRef();
  useEffect(() => {
    if (data === undefined || width === null) return;
    const parsedData = prepareData(data);
    const chart = Plot.plot({
      width: width,
      marginLeft: 200,
      style: {
        background: "transparent",
      },
      x: {
        type: "symlog",
        domain: [-6, 6],
        grid: true,
      },
      color: {
        type: "diverging",
        scheme: "burd",
      },
      marks: [
        Plot.ruleX([-1], { strokeDasharray: 4, stroke: "#EC2846" }),
        Plot.boxX(parsedData, {
          r: 0,
          x: "geneEffect",
          y: "tissueName",
          opacity: 0.5,
        }),
        Plot.dot(parsedData, {
          x: "geneEffect",
          y: "tissueName",
          tip: true,
          fill: d => (d.geneEffect < -1 ? "#EC2846" : "#08519C"),
          fillOpacity: 0.5,
        }),
        Plot.crosshair(parsedData, { x: "geneEffect", y: "tissueName" }),
      ],
    });
    headerRef.current.append(chart);
    return () => chart.remove();
  }, [data, width]);

  return <div ref={headerRef}></div>;
}

export default Wrapper;
