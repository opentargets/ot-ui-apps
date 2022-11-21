import { useState, useEffect } from 'react';
import { Slider } from '@material-ui/core';
import useAotfContext from '../hooks/useAotfContext';

const sliderPayload = (id, value) => ({
  id,
  weight: value,
  propagate: true,
});

const getSliderValue = (values, id) => {
  const value = values.find(val => val.id === id).weight;
  return value;
};

/* TODO: review rerender on mount */
function SliderControll({ def, id }) {
  const { dataSourcesWeights, setDataSourcesWeights } = useAotfContext();

  const [value, setValue] = useState(def);
  const [displayValue, setDisplayValue] = useState(def);

  useEffect(() => {
    const newDataValue = sliderPayload(id, value);
    const newDataSources = dataSourcesWeights.map(src => {
      if (src.id === id) {
        return newDataValue;
      }
      return src;
    });
    setDataSourcesWeights(newDataSources);
  }, [value, id, setDataSourcesWeights]);

  useEffect(() => {
    const newValue = getSliderValue(dataSourcesWeights, id);
    setDisplayValue(newValue);
  }, [dataSourcesWeights, id]);

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
