import sections from '../../../pages/TargetPage/sections';
import { Grid } from '@material-ui/core';
import { styled } from '@material-ui/styles';

const SectionWrapper = styled('div')({
  marginBottom: '40px',
});

// Wrapper of the sections
function SecctionRenderer({ activeSection, rowId }) {
  const toSearch = activeSection[2];
  const section = sections.find(el => el.definition.id === toSearch);

  // Validate if the active section is not in Evidence sections
  if (typeof section === 'undefined') {
    console.error('SECTION NOT FOUND: ', toSearch);
    return null;
  }

  const { Body, definition } = section;
  const ensgId = rowId;

  return (
    <SectionWrapper>
      <Grid id="summary-section" container spacing={1}>
        <Body
          definition={definition}
          id={ensgId}
          label={definition.shortName}
        />
      </Grid>
    </SectionWrapper>
  );
}

export default SecctionRenderer;
