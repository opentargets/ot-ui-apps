import { v1 } from "uuid";
import { Widget } from "sections";

type SummaryRendererProps = {
  widgets: Widget[];
  useKeys?: boolean;
  keyPrefix?: string;
};

function SummaryRenderer({ 
  widgets,
  useKeys = true, 
  keyPrefix = "summary" 
}: SummaryRendererProps) {
  return (
    <>
      {widgets.map((widget, index) => {
        const Summary = widget.Summary;
        const key = useKeys ? `${keyPrefix}-${v1()}` : `${keyPrefix}-${index}`;
        return <Summary key={key} />;
      })}
    </>
  );
}

export default SummaryRenderer; 