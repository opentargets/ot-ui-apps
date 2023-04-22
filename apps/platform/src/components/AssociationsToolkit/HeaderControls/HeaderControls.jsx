import { Collapse, Grid, Typography } from '@material-ui/core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import dataSources from '../static_datasets/dataSourcesAssoc';

import Slider from './SliderControl';
import Required from './RequiredControl';

import useAotfContext from '../hooks/useAotfContext';

import { styled } from '@material-ui/styles';

const CloseContainer = styled('div')({
  position: 'absolute',
  left: '10px',
  top: '10px',
  cursor: 'pointer',
  zIndex: 10,
});

function HeaderControls({ cols }) {
  const { activeHeadersControlls, setActiveHeadersControlls, displayedTable } =
    useAotfContext();

  if (displayedTable === 'prioritisations') return null;

  const handleClose = () => {
    setActiveHeadersControlls(false);
  };

  return (
    <Collapse in={activeHeadersControlls}>
      <div className="weights-controlls">
        <Grid
          container
          direction="row"
          wrap="nowrap"
          className="controlls-container"
        >
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
            <Grid item>
              <Typography variant="subtitle2">
                Datasource weight control:
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="subtitle2">Required datasource:</Typography>
            </Grid>
          </Grid>
          <Grid item container className="grid-container controlls-wrapper">
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
          </Grid>
        </Grid>
      </div>
    </Collapse>
  );
}

export default HeaderControls;
