/* eslint-disable prefer-destructuring */
import { v1 } from 'uuid';
import { Suspense, useState } from 'react';
import { useQuery } from '@apollo/client';
import BasePage from '../../components/BasePage';

import { BlockWrapper } from './components';
import BlockHeader from './BlockHeader';
import EditDrawer from './EditDrawer';

import targetSections from './sections/targetSections';
import evidenceSections from './sections/evidenceSections';
import drugSections from './sections/drugSections';
import diseaseSections from './sections/diseaseSections';

import { ENTITIES, INIT_BLOCKS_STATE, getBlockProfileQuery } from './utils';

function SectionRender({ entity, section, inputs = [] }) {
  let Component = null;
  let id = null;
  let label = null;
  switch (entity) {
    case ENTITIES.TARGET:
      Component = targetSections.get(section);
      id = inputs[0];
      break;
    case ENTITIES.DISEASE:
      Component = diseaseSections.get(section);
      id = inputs[0];
      break;
    case ENTITIES.DRUG:
      Component = drugSections.get(section);
      id = inputs[0];
      break;
    case ENTITIES.EVIDENCE:
      Component = evidenceSections.get(section);
      id = { ensgId: inputs[0], efoId: inputs[1] };
      label = { symbol: '', name: '' };
      break;
    default:
      return 'No Section parser';
  }
  return <Component key={v1()} id={id} label={label} />;
}

function BlockRender({ entity, inputs, children }) {
  const { query, variables } = getBlockProfileQuery({ entity, inputs });
  const { data, loading, error } = useQuery(query, {
    variables,
  });

  if (loading) return <BlockWrapper>Loading block ...</BlockWrapper>;
  if (!data && !loading) return null;
  if (error) return null;

  return (
    <BlockWrapper>
      <BlockHeader entity={entity} data={data} />
      {children}
    </BlockWrapper>
  );
}

function TheoremPage() {
  const [blocks, setBlocks] = useState(INIT_BLOCKS_STATE);

  return (
    <BasePage>
      <EditDrawer blocks={blocks} setBlocks={setBlocks} />
      {blocks.map(({ entity, sections, inputs }) => (
        <BlockRender key={v1()} entity={entity} inputs={inputs}>
          {sections.map(section => (
            <Suspense key={v1()} fallback="Loading">
              <SectionRender
                entity={entity}
                section={section}
                inputs={inputs}
              />
            </Suspense>
          ))}
        </BlockRender>
      ))}
    </BasePage>
  );
}

export default TheoremPage;
