import { Box, Collapse, Grid, Typography } from '@mui/material';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { styled } from '@mui/material/styles';
import dataSources from '../static_datasets/dataSourcesAssoc';

import Slider from './SliderControl';
import Required from './RequiredControl';
import { GridContainer } from '../layout';

import useAotfContext from '../hooks/useAotfContext';

const CloseContainer = styled('div')({
  position: 'absolute',
  left: '10px',
  top: '10px',
  cursor: 'pointer',
  zIndex: 10,
});

function HeaderControls({ cols = [] }) {
  const { activeHeadersControlls, setActiveHeadersControlls, displayedTable } =
    useAotfContext();

  if (displayedTable === 'prioritisations') return null;

  const handleClose = () => {
    setActiveHeadersControlls(false);
  };

  return (
    <Collapse in={activeHeadersControlls}>
      <div className="weights-controlls">
        <Grid container direction="row" wrap="nowrap">
          <CloseContainer onClick={handleClose}>
            <FontAwesomeIcon icon={faXmark} size="lg" />
          </CloseContainer>
          <Grid
            item
            container
            direction="column"
            className="header-controls-labels"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="subtitle2">Weight</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2">Require</Typography>
            </Box>
          </Grid>
          <GridContainer
            columnsCount={cols.length}
            className="controlls-wrapper"
          >
            {cols.map(({ id }) => (
              <div key={id} className="colum-control">
                <Grid className="control-container" key={id}>
                  <Slider id={id} />
                </Grid>
                <div className="required-container">
                  <Required
                    id={id}
                    aggregationId={
                      (dataSources.find(el => el.id === id).aggregationId, id)
                    }
                  />
                </div>
              </div>
            ))}
          </GridContainer>
        </Grid>
      </div>
    </Collapse>
  );
}

export default HeaderControls;
