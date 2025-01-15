import { useRef, useEffect } from "react";
import { Box } from "@mui/material";

type ObsChartProps = {
  data: any;
  otherData?: any;
  width: number;
  height: number;
  renderChart?: (params: {
    data: any;
    otherData?: any;
    width: number;
    height: number;
  }) => SVGSVGElement;
  processChart?: (chart: SVGSVGElement) => void;
  hasTooltip: boolean;
  fadeElement?: (elmt: SVGElement) => void;
  highlightElement?: (elmt: SVGElement) => void;
  resetElement?: (elmt: SVGElement) => void;
  setChart?: Dispatch<SetStateAction<SVGSVGElement>>;
  setDatum?: Dispatch<SetStateAction<number>>;
};

function ObsChart({
  data,
  otherData,
  width,
  height,
  renderChart,
  processChart,
  hasTooltip,
  fadeElement,
  highlightElement,
  resetElement,
  setChart,
  setDatum,
}) {
  const headerRef = useRef();

  useEffect(() => {
    if (data === undefined || width === null) return;
    const chart = renderChart({ data, otherData, width, height });
    setChart(chart);
    processChart?.(chart);
    if (hasTooltip) {
      let clickStick = false;
      const tooltipMarks = chart.querySelectorAll(".obs-tooltip *");
      for (const elmt of tooltipMarks) {
        const dataIndex = elmt.__data__;
        elmt.setAttribute("data-index", dataIndex);
        elmt.addEventListener("mouseenter", event => {
          if (!clickStick) {
            setDatum(data[dataIndex]);
            tooltipMarks.forEach(fadeElement);
            // possibly multiple marks for same datum
            chart.querySelectorAll(`[data-index="${dataIndex}"]`).forEach(highlightElement);
          }
        });
        elmt.addEventListener("mouseleave", event => {
          if (!clickStick) {
            setDatum(null);
            tooltipMarks.forEach(resetElement);
          }
        });
      }
      chart.addEventListener("click", event => {
        clickStick = !clickStick;
        if (!clickStick) {
          setDatum(null);
          tooltipMarks.forEach(resetElement);
        }
      });
    }
    headerRef.current.append(chart);
    return () => chart.remove();
  }, [data, width, height, setChart, setDatum]);

  return <Box ref={headerRef}></Box>;
}

export default ObsChart;
