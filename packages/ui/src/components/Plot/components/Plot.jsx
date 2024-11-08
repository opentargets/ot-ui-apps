import { PlotProvider } from "../contexts/PlotContext";
import SVGContainer from "./SVGContainer";

export default function Plot({ children, ...options }) {
  return (
    <PlotProvider options={options}>
      <SVGContainer>
        {children}
      </SVGContainer>
    </PlotProvider> 
  );
}