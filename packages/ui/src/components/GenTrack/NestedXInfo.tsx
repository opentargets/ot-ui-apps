import { useState, useEffect } from "react";

function NestedXInfo({ data, viewModel, XInfo, isInner, canvasWidth }) {
  const [range, setRange] = useState({
    start: viewModel.start,
    end: viewModel.end,
  });

  useEffect(() => {
    return viewModel.subscribe(({ start, end }) => {
      setRange({ start, end });
    });
  }, [viewModel]);

  return <XInfo data={data} start={range.start} end={range.end} canvasWidth={canvasWidth} />;
}

export default NestedXInfo;