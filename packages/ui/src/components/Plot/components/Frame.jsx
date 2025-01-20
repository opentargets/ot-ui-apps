import { FrameProvider, useFrame } from "../contexts/FrameContext";
import { usePlot } from "../contexts/PlotContext";

export default function Frame({ children, options }) {
  const plot = usePlot();
  if (!plot) {
    throw Error("Frame component must appear inside a Plot component");
  }
  const outerFrame = useFrame();
  if (outerFrame) {
    throw Error("Frame components cannot be nested");
  }

  return <FrameProvider options={options}>{children}</FrameProvider>;
}
