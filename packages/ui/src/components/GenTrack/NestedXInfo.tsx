import { useState, useEffect } from "react";

function NestedXInfo({ viewModel, XInfo, canvasWidth }) {
  const [range, setRange] = useState({
    start: viewModel.start,
    end: viewModel.end,
  });

  useEffect(() => {
    return viewModel.subscribe(({ start, end }) => {
      setRange({ start, end });
    });
  }, [viewModel]);

  return <XInfo start={range.start} end={range.end} canvasWidth={canvasWidth} />;
}

export default NestedXInfo;