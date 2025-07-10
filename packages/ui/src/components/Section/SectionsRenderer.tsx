import { Suspense } from "react";
import { Widget } from "sections";
import usePermissions from "../../hooks/usePermissions";
import SectionLoader from "./SectionLoader";

type SectionsRendererProps = {
  id: string | { ensgId: string; efoId: string };
  label: string | { symbol: string; name: string };
  entity: string;
  widgets: Widget[];
};

function SectionsRenderer({ id, label, entity, widgets }: SectionsRendererProps) {
  const { isPartnerPreview } = usePermissions();
  return (
    <>
      {widgets.map(widget => {
        const Body = widget.getBodyComponent();
        const isPrivate = widget.definition.isPrivate;
        if (isPrivate && !isPartnerPreview) {
          return null;
        }
        return (
          <Suspense key={widget.definition.id} fallback={<SectionLoader />}>
            <Body id={id} label={label} entity={entity} />
          </Suspense>
        );
      })}
    </>
  );
}

export default SectionsRenderer;
