import { Slider, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { decimalPlaces } from '../../constants';

const useStyles = makeStyles(() => ({
  root: {
    width: 300,
  },
  container: {
    padding: '10px 0',
  },
}));

function ClassicAssociationsSlider({
  value,
  onChange,
  onChangeCommitted,
}) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography id="label">
        Minimum Score: {value.toFixed(decimalPlaces)}
      </Typography>
      <Slider
        classes={{
          root: classes.container,
        }}
        defaultValue={value}
        value={value}
        step={0.01}
        min={0}
        max={1}
        onChange={onChange}
        onChangeCommitted={onChangeCommitted}
      />
    </div>
  );
}

export default ClassicAssociationsSlider;
