import { ReactElement, useState } from "react";
import { Slider } from "@mui/material";
import { styled } from "@mui/material/styles";

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

type SliderControlPorps = {
  id: string;
  handleChangeSliderCommitted: (newValue: number | number[], id: string) => void;
};

function SliderControll({ id, handleChangeSliderCommitted }: SliderControlPorps): ReactElement {
  const initialValue = getWightSourceDefault(id);

  const [displayValue, setDisplayValue] = useState<number | number[]>(initialValue);

  const handleChange = (_: Event, newValue: number | number[]) => {
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
      marks={[{ value: initialValue }]}
      valueLabelDisplay="auto"
    />
  );
}

export default SliderControll;
