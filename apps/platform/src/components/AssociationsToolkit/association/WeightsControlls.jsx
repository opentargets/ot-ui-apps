import { Collapse, Button } from '@material-ui/core';
import { faXmark, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Slider from './SliderControll';
import useAotfContext from '../hooks/useAotfContext';

import { styled } from '@material-ui/styles';

const CloseContainer = styled('div')({
  position: 'absolute',
  left: '10px',
  top: '10px',
  cursor: 'pointer',
  zIndex: 10,
});

const ActionsControlls = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  height: '130px',
  width: '280px',
});

const ResetContainer = styled('div')({
  display: 'flex',
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  '& span': {
    marginLeft: '10px',
  },
});

function WeightsControlls({ cols }) {
  const {
    activeWeightsControlls,
    setActiveWeightsControlls,
    dataSourcesWeights,
    defaulDatasourcesWeigths,
    setDataSourcesWeights,
    displayedTable,
  } = useAotfContext();

  if (displayedTable === 'prioritisations') return null;

  const handleClose = () => {
    setActiveWeightsControlls(false);
  };

  const getWightSourceDefault = source => {
    const sourcesDetails = defaulDatasourcesWeigths.find(
      src => src.id === source
    );
    return sourcesDetails.weight;
  };

  return (
    <Collapse in={activeWeightsControlls}>
      <div className="weights-controlls">
        <div className="controlls-container">
          <CloseContainer onClick={handleClose}>
            <FontAwesomeIcon icon={faXmark} size="lg" />
          </CloseContainer>
          {/* <ActionsControlls>
            <ResetContainer>
              <Button
                onClick={() => {
                  setDataSourcesWeights(defaulDatasourcesWeigths);
                }}
                disableElevation
              >
                <FontAwesomeIcon icon={faRotateLeft} />
                <span>Reset controlls</span>
              </Button>
            </ResetContainer>
          </ActionsControlls> */}
          <div className="grid-container controlls-wrapper">
            {cols.map(({ id }) => (
              <div className="controll-container" key={id}>
                <Slider def={getWightSourceDefault(id)} id={id} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Collapse>
  );
}

export default WeightsControlls;
