import { useState } from 'react';
import { Slider } from '@material-ui/core';

function SliderControll({ def, id }) {
  const [value, setValue] = useState(def);
  const [displayValue, setDisplayValue] = useState(def);

  const handleChange = (event, newValue) => {
    setDisplayValue(newValue);
  };

  const handleChangeCommitted = (event, newValue) => {
    setValue(newValue);
  };

  function valuetext(value) {
    return parseFloat(value).toFixed(1);
  }

  return (
    <>
      <Slider
        orientation="vertical"
        value={displayValue}
        aria-labelledby="vertical-slider"
        min={0}
        max={1.0}
        step={0.1}
        onChange={handleChange}
        onChangeCommitted={handleChangeCommitted}
      />
      <span>{valuetext(displayValue)}</span>
    </>
  );
}

export default SliderControll;
