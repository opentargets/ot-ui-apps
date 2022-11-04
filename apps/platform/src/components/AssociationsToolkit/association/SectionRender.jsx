import sections from '../../../pages/EvidencePage/sections';
import { Grid } from '@material-ui/core';
import { styled } from '@material-ui/styles';

const SectionWrapper = styled('div')({
  marginBottom: '40px',
});

// Wrapper of the sections
function SecctionRenderer({ activeSection, entity, rowId, id, label }) {
  const toSearch = activeSection[0];
  const section = sections.find(el => el.definition.id === toSearch);

  // Validate if the active section is not in Evidence sections
  if (typeof section === 'undefined') return null;

  const { Body, definition } = section;

  const ensgId = entity === 'disease' ? rowId : id;
  const efoId = entity === 'disease' ? id : rowId;

  return (
    <SectionWrapper>
      <Grid id="summary-section" container spacing={1}>
        <Body
          definition={definition}
          id={{ ensgId, efoId }}
          label={{ symbol: label, name: definition.name }}
        />
      </Grid>
    </SectionWrapper>
  );
}

export default SecctionRenderer;
