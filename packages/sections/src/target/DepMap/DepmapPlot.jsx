import { useRef, useEffect } from "react";
import * as Plot from "@observablehq/plot";
import { useMeasure } from "@uidotdev/usehooks";

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
    <div style={{ width: "100%" }} ref={ref}>
      <DepmapPlot data={data} width={width} />
    </div>
  );
}

function DepmapPlot({ data, width }) {
  const headerRef = useRef();
  useEffect(() => {
    if (data === undefined) return;
    const parsedData = prepareData(data);
    console.log(parsedData);
    const chart = Plot.plot({
      width: width,
      marginLeft: 200,
      style: {
        background: "transparent",
      },
      x: {
        grid: true,
      },
      color: {
        type: "diverging",
        scheme: "burd",
      },
      marks: [
        Plot.ruleX([-1], { strokeDasharray: 4, stroke: "tomato" }),
        Plot.boxX(parsedData, { x: "geneEffect", y: "tissueName", opacity: 0.5 }),
        Plot.dot(parsedData, { x: "geneEffect", y: "tissueName", opacity: 0.9 }),
        Plot.crosshair(parsedData, { x: "geneEffect", y: "tissueName" }),
      ],
    });
    headerRef.current.append(chart);
    return () => chart.remove();
  }, [data, width]);

  return <div ref={headerRef}></div>;
}

export default Wrapper;
