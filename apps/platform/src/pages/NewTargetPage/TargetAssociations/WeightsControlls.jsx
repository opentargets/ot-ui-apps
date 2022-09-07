import { Collapse, Slider } from '@material-ui/core';

function WeightsControlls({ active, cols }) {
  return (
    <Collapse in={active}>
      <div className="weights-controlls">
        <div className="controlls-container">
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
