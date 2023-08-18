import { Suspense } from 'react';
import { styled } from '@material-ui/styles';
import { LoadingBackdrop } from 'ui';
import { ENTITIES } from '../utils';

import targetSections from '../../../sections/targetSections';
import evidenceSections from '../../../sections/evidenceSections';

const LoadingContainer = styled('div')({
  margin: '50px 0',
});

const Container = styled('div')({
  marginTop: '10px',
  marginBottom: '40px',
});

function LoadingSection() {
  return (
    <LoadingContainer>
      <LoadingBackdrop />
      Loading section count
    </LoadingContainer>
  );
}

function SectionNotFound() {
  return <div>Section not found</div>;
}

export function SectionRender({
  id,
  entity,
  section,
  row,
  entityToGet,
  rowNameEntity,
  rowId,
  displayedTable,
  cols = [],
  expanded,
}) {
  let label = row.original[entityToGet][rowNameEntity];
  let ensgId;
  let efoId;
  let componentId;
  let Component;
  let entityOfSection = entity;

  const flatCols = cols.map(c => c.id);
  if (!flatCols.includes(expanded[1])) return null;

  switch (displayedTable) {
    case 'prioritisations': {
      Component = targetSections.get(section);
      const { targetSymbol } = row.original;
      ensgId = entity === ENTITIES.DISEASE ? rowId : id;
      label = targetSymbol;
      componentId = ensgId;
      entityOfSection = 'target';
      break;
    }
    case 'associations': {
      Component = evidenceSections.get(section);
      const { diseaseName, targetSymbol } = row.original;
      ensgId = entity === ENTITIES.DISEASE ? rowId : id;
      efoId = entity === ENTITIES.DISEASE ? id : rowId;
      componentId = { ensgId, efoId };
      label = { symbol: targetSymbol, name: diseaseName };
      entityOfSection = 'disease';
      break;
    }
    default:
      return <SectionNotFound />;
  }
  return <Component id={componentId} label={label} entity={entityOfSection} />;
}

export function SectionRendererWrapper({ children }) {
  return (
    <Suspense fallback={<LoadingSection />}>
      <Container>{children}</Container>
    </Suspense>
  );
}
