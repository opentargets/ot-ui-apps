import { Suspense } from "react";
import { Skeleton } from "@mui/material";
import { Widget } from "sections";

type SectionsRendererProps = {
  id: string;
  label: string;
  entity: string;
  widgets: Widget[];
  skeletonHeight?: number;
  skeletonWidth?: string;
};

function SectionsRenderer({ 
  id, 
  label, 
  entity, 
  widgets, 
  skeletonHeight = 85, 
  skeletonWidth = "100%" 
}: SectionsRendererProps) {
  return (
    <>
      {widgets.map((widget) => {
        const Body = widget.getBodyComponent();
        return (
          <Suspense 
            key={widget.definition.id} 
            fallback={
              <Skeleton 
                height={skeletonHeight} 
                sx={{ width: skeletonWidth }} 
              />
            }
          >
            <Body id={id} label={label} entity={entity} />
          </Suspense>
        );
      })}
    </>
  );
}

export default SectionsRenderer; 