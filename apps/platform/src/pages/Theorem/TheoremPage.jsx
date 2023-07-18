import { v1 } from 'uuid';
import { Suspense, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Typography } from '@material-ui/core';

import BasePage from '../../components/BasePage';

import { BlockWrapper } from './components';
import EditDrawer from './EditDrawer';

import targetSections from './targetSections';
import evidenceSections from './evidenceSections';
import {
  ENTITIES,
  INIT_BLOCKS_STATE,
  getBlockName,
  getBlockProfileQuery,
} from './utils';

function getSection({ entity, section, inputs }) {
  let Component = null;
  const label = { symbol: '', name: '' };
  switch (entity) {
    case ENTITIES.TARGET:
      Component = targetSections.get(section);
      return <Component key={v1()} id={inputs[0]} />;
    case ENTITIES.EVIDENCE:
      Component = evidenceSections.get(section);
      return (
        <Component
          key={v1()}
          id={{ ensgId: inputs[0], efoId: inputs[1] }}
          label={label}
        />
      );
    default:
      return 'No Section parser';
  }
}

function BlockRender({ entity, inputs, children }) {
  const { query, variables } = getBlockProfileQuery({ entity, inputs });
  const { data, loading, error } = useQuery(query, {
    variables,
  });

  if (loading) return <BlockWrapper>Loading block ...</BlockWrapper>;
  if (!data && !loading) return null;
  if (error) return null;

  const blockName = getBlockName({ entity, data });

  return (
    <BlockWrapper>
      <Typography variant="h5">{blockName}</Typography>
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
              {getSection({
                entity,
                section,
                inputs,
              })}
            </Suspense>
          ))}
        </BlockRender>
      ))}
    </BasePage>
  );
}

export default TheoremPage;
