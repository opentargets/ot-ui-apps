import { useState, useEffect } from "react";
import { Slider } from "@mui/material";
import { styled } from "@mui/material/styles";

import useAotfContext from "../../hooks/useAotfContext";
import { getWightSourceDefault } from "../../utils";

const OTSlider = styled(Slider)({
  root: {
    padding: "0 10px !important",
  },
  mark: {
    backgroundColor: "#b8b8b8",
    width: 10,
    height: 1,
    marginLeft: -4,
  },
  valueLabel: {
    zIndex: "9999",
  },
});

const sliderPayload = (id, value) => ({
  id,
  weight: value,
  propagate: true,
});

const getSliderValue = (values, id) => {
  const value = values.find(val => val.id === id).weight;
  return value;
};

function SliderControll({ id, handleChangeSliderCommitted }) {
  // use new state.dataSourcesWeights
  const { dataSourcesWeights } = useAotfContext();

  const defaultValue = getWightSourceDefault(id);
  const initialValue = getSliderValue(dataSourcesWeights, id);

  const [displayValue, setDisplayValue] = useState(initialValue);

  const handleChange = (_, newValue) => {
    setDisplayValue(newValue);
  };

  return (
    <OTSlider
      size="small"
      orientation="vertical"
      value={displayValue}
      aria-labelledby="vertical-slider"
      min={0}
      max={1.0}
      step={0.1}
      onChange={handleChange}
      onChangeCommitted={(_, newValue) => handleChangeSliderCommitted(newValue, id)}
      marks={[{ value: defaultValue }]}
      valueLabelDisplay="auto"
    />
  );
}

export default SliderControll;
