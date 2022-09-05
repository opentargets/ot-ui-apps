import dataSources from './dataSourcesAssoc';
import sections from '../../EvidencePage/sections';
import { Grid } from '@material-ui/core';
import { styled } from '@material-ui/styles';

const SectionWrapper = styled('div')({
  marginBottom: '40px',
});

// Wrapper of the sections
function SecctionRenderer({ ensgId, efoId, label, activeSection }) {
  const toSearch = dataSources.filter(el => el.id === activeSection[0])[0]
    .sectionId;
  const { Body, definition } = sections.filter(
    el => el.definition.id === toSearch
  )[0];

  return (
    <SectionWrapper>
      <Grid id="summary-section" container spacing={1}>
        <Body
          definition={definition}
          id={{ ensgId, efoId }}
          label={{ symbol: definition.shortName, name: definition.name }}
        />
      </Grid>
    </SectionWrapper>
  );
}

export default SecctionRenderer;
