import { useRef, useEffect, Dispatch, SetStateAction } from "react";
import { Box } from "@mui/material";

type ObsChartProps = {
  data: any;
  otherData?: any;
  width: number;
  height: number;
  renderChart: (params: {
    data: any;
    otherData?: any;
    width: number;
    height: number;
  }) => SVGSVGElement;
  hasTooltip: boolean;
  fadeElement?: (elmt: SVGElement) => void;
  highlightElement?: (elmt: SVGElement) => void;
  resetElement?: (elmt: SVGElement) => void;
  setChart: Dispatch<SetStateAction<SVGSVGElement>>;
  setDatum: Dispatch<SetStateAction<any>>;
};

function ObsChart({
  data,
  otherData,
  width,
  height,
  renderChart,
  hasTooltip,
  fadeElement,
  highlightElement,
  resetElement,
  setChart,
  setDatum,
}: ObsChartProps) {
  const headerRef = useRef();

  useEffect(() => {
    if (data === undefined || width === null) return;
    const chart = renderChart({ data, otherData, width, height });
    setChart(chart);
    if (hasTooltip) {
      let clicked = false;
      let selectedDatum;
      const tooltipMarks = chart.querySelectorAll(".obs-tooltip *");
      for (const elmt of tooltipMarks) {
        const dataIndex = elmt.__data__;
        const elmtDatum = data[dataIndex];
        const highlightSelected = () => {
          if (fadeElement) tooltipMarks.forEach(fadeElement);
          // possibly multiple mark elements for same datum
          if (highlightElement) {
            chart.querySelectorAll(`[data-index="${dataIndex}"]`).forEach(highlightElement);
          }
        };
        elmt.setAttribute("data-index", dataIndex);
        elmt.addEventListener("click", event => {
          if (clicked && selectedDatum === elmtDatum) {
            clicked = false;
            selectedDatum = null;
          } else {
            clicked = true;
            selectedDatum = elmtDatum;
            highlightSelected();
          }
          setDatum(selectedDatum);
          event.stopPropagation();
        });
        elmt.addEventListener("mouseenter", () => {
          if (!clicked) {
            selectedDatum = elmtDatum;
            setDatum(selectedDatum);
            highlightSelected();
          }
        });
        elmt.addEventListener("mouseleave", () => {
          if (!clicked) {
            selectedDatum = null;
            setDatum(selectedDatum);
            if (resetElement) tooltipMarks.forEach(resetElement);
          }
        });
      }
      chart.addEventListener("click", () => {
        if (clicked) {
          clicked = false;
          selectedDatum = null;
          setDatum(selectedDatum);
          if (resetElement) tooltipMarks.forEach(resetElement);
        }
      });
    }
    headerRef.current.append(chart);
    return () => {
      setDatum(null);
      chart.remove();
    };
  }, [
    data,
    otherData,
    width,
    height,
    renderChart,
    hasTooltip,
    fadeElement,
    highlightElement,
    resetElement,
    setChart,
    setDatum,
  ]);

  return <Box ref={headerRef}></Box>;
}

export default ObsChart;
