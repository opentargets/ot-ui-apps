import { useState, useEffect } from 'react';
import { Slider } from '@mui/material';
import { withStyles } from '@mui/styles';
import useAotfContext from '../hooks/useAotfContext';
import { getWightSourceDefault } from '../utils';

const OTSlider = withStyles({
  mark: {
    backgroundColor: '#b8b8b8',
    width: 10,
    height: 1,
    marginLeft: -4,
  },
  valueLabel: {
    zIndex: '9999',
  },
})(Slider);

const sliderPayload = (id, value) => ({
  id,
  weight: value,
  propagate: true,
});

const getSliderValue = (values, id) => {
  const value = values.find(val => val.id === id).weight;
  return value;
};

function SliderControll({ id }) {
  const { dataSourcesWeights, setDataSourcesWeights } = useAotfContext();

  const defaultValue = getWightSourceDefault(id);
  const initialValue = getSliderValue(dataSourcesWeights, id);

  const [value, setValue] = useState(initialValue);
  const [displayValue, setDisplayValue] = useState(initialValue);

  useEffect(() => {
    if (initialValue === value) return;
    const newDataValue = sliderPayload(id, value);
    const newDataSources = dataSourcesWeights.map(src => {
      if (src.id === id) {
        return newDataValue;
      }
      return src;
    });
    setDataSourcesWeights(newDataSources);
  }, [value]);

  useEffect(() => {
    const newValue = getSliderValue(dataSourcesWeights, id);
    if (newValue === value) return;
    setDisplayValue(newValue);
  }, [dataSourcesWeights]);

  const handleChange = (_, newValue) => {
    setDisplayValue(newValue);
  };

  const handleChangeCommitted = (_, newValue) => {
    setValue(newValue);
  };

  return (
    <OTSlider
      orientation="vertical"
      value={displayValue}
      aria-labelledby="vertical-slider"
      min={0}
      max={1.0}
      step={0.1}
      onChange={handleChange}
      onChangeCommitted={handleChangeCommitted}
      marks={[{ value: defaultValue }]}
      valueLabelDisplay="auto"
    />
  );
}

export default SliderControll;
