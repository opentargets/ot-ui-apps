import { Collapse } from '@material-ui/core';
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

function WeightsControlls({ cols }) {
  const { activeWeightsControlls, setActiveWeightsControlls, displayedTable } =
    useAotfContext();

  if (displayedTable === 'prioritisations') return null;

  const handleClose = () => {
    setActiveWeightsControlls(false);
  };

  return (
    <Collapse in={activeWeightsControlls}>
      <div className="weights-controlls">
        <div className="controlls-container">
          <CloseContainer onClick={handleClose}>
            <FontAwesomeIcon icon={faXmark} size="lg" />
          </CloseContainer>
          <div className="grid-container controlls-wrapper">
            {cols.map(({ id }) => (
              <div key={id} className="colum-control">
                <div className="control-container" key={id}>
                  <Slider id={id} />
                </div>
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
          </div>
        </div>
      </div>
    </Collapse>
  );
}

export default WeightsControlls;
