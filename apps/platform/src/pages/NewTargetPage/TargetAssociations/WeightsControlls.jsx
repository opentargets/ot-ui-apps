import { Collapse, Slider, Button } from '@material-ui/core';
import { faXmark, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

function WeightsControlls({ active, cols, setActive }) {
  const handleClose = () => {
    setActive(false);
  };
  return (
    <Collapse in={active}>
      <div className="weights-controlls">
        <div className="controlls-container">
          <CloseContainer onClick={handleClose}>
            <FontAwesomeIcon icon={faXmark} size="lg" />
          </CloseContainer>
          <ActionsControlls>
            <ResetContainer>
              <Button
                // onClick={() => setVizControllsOpen(true)}
                disableElevation
              >
                <FontAwesomeIcon icon={faRotateLeft} />
                <span>Reset controlls</span>
              </Button>
            </ResetContainer>
          </ActionsControlls>
          {cols.map(headerGroup =>
            headerGroup.headers.map(({ id }) => {
              // Exclude name and
              if (id === 'name')
                return <div key={id} className="name-empty-controll"></div>;
              if (id === 'score')
                return <div key={id} className="score-empty-controll"></div>;
              return (
                <div className="controll-container" key={id}>
                  <Slider
                    orientation="vertical"
                    defaultValue={30}
                    aria-labelledby="vertical-slider"
                  />
                  <span>{0.4}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Collapse>
  );
}

export default WeightsControlls;
