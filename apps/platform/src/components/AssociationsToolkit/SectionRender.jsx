import dataSources from './dataSourcesAssoc';
// import sections from '../../EvidencePage/sections';
import sections from '../../pages/EvidencePage/sections';
import { Grid } from '@material-ui/core';
import { styled } from '@material-ui/styles';

const SectionWrapper = styled('div')({
  marginBottom: '40px',
});

// Wrapper of the sections
function SecctionRenderer({ activeSection, entity, rowId, id }) {
  // const toSearch = dataSources.find(el => el.id === activeSection[0]).sectionId;
  const toSearch = activeSection[0];
  const { Body, definition } = sections.find(
    el => el.definition.id === toSearch
  );

  const ensgId = entity === 'disease' ? rowId : id;
  const efoId = entity === 'disease' ? id : rowId;

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
