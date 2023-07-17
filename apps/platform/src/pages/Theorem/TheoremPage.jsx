import { v1 } from 'uuid';
import { Suspense } from 'react';
import { useQuery } from '@apollo/client';
import { Typography } from '@material-ui/core';
import { TreeItem, TreeView } from '@material-ui/lab';

import BasePage from '../../components/BasePage';

import { BlockWrapper } from './components';

import targetSections from './targetSections';

import TARGET_PROFILE_QUERY from './TargetProfile.gql';

const sampleState = [
  {
    id: 'target_ENSG00000196230',
    entity: 'target',
    inputs: ['ENSG00000196230'],
    sections: ['safety'],
  },
  {
    id: 'target_ENSG00000157764',
    entity: 'target',
    inputs: ['ENSG00000157764'],
    sections: ['safety', 'bibliography'],
  },
];

function getSection({ entity, section, id }) {
  switch (entity) {
    case 'target':
      const Component = targetSections.get(section);
      return <Component key={v1()} id={id} />;
    default:
      return 'Error';
  }
}

function getBlockProfileQuery({ entity }) {
  switch (entity) {
    case 'target':
      return TARGET_PROFILE_QUERY;
    default:
      return 'Error';
  }
}

function BlockRender({ id, entity, children }) {
  const query = getBlockProfileQuery({ entity });
  const { data, loading, error } = useQuery(query, {
    variables: { ensemblId: id },
  });

  if (loading) return 'Loading block ...';
  if (!data && !loading) return null;
  if (error) return null;

  return (
    <div>
      <Typography variant="h5">{data.target.approvedSymbol}</Typography>
      <BlockWrapper>{children}</BlockWrapper>
    </div>
  );
}

function TheoremPage() {
  return (
    <BasePage>
      <TreeView>
        {sampleState.map(({ entity, sections, inputs }) => (
          <TreeItem key={v1()} nodeId={v1()} label={`${entity} ${inputs[0]}`}>
            {sections.map(section => (
              <TreeItem key={v1()} nodeId={v1()} label={section} />
            ))}
          </TreeItem>
        ))}
      </TreeView>
      <Suspense>
        {sampleState.map(({ entity, sections, inputs }) => (
          <BlockRender entity={entity} key={v1()} id={inputs[0]}>
            {sections.map(section =>
              getSection({
                entity,
                section,
                id: inputs[0],
              })
            )}
          </BlockRender>
        ))}
      </Suspense>
    </BasePage>
  );
}

export default TheoremPage;
