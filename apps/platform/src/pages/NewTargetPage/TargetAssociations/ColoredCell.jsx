import { scaleQuantize } from 'd3';
import Tooltip from '@material-ui/core/Tooltip';

/* UTILS */
/* Color scale */
const COLORS = [
  // '#f7fbff',
  '#deebf7',
  '#c6dbef',
  '#9ecae1',
  '#6baed6',
  '#4292c6',
  '#2171b5',
  '#08519c',
  // '#08306b',
];
const linearScale = scaleQuantize().domain([0, 1]).range(COLORS);

function ColoredCell({ scoreValue, onClick, rounded, globalScore, cell }) {
  const onClickHabdler = onClick ? () => onClick(cell) : () => {};
  const backgroundColor = scoreValue ? linearScale(scoreValue) : '#fafafa';
  const borderColor = scoreValue ? linearScale(scoreValue) : '#e0dede';
  const className = globalScore
    ? 'data-global-score'
    : scoreValue
    ? 'data-score'
    : 'data-empty';
  const scoreText = scoreValue ? `Score: ${scoreValue.toFixed(2)}` : 'No data';

  const style = {
    height: '25px',
    width: rounded ? '26px' : '30px',
    borderRadius: rounded ? '13px' : 0,
    backgroundColor,
    border: `1.5px solid ${borderColor}`,
  };

  return (
    <Tooltip title={scoreText} arrow>
      <div className={className} onClick={onClickHabdler} style={style}></div>
    </Tooltip>
  );
}

export default ColoredCell;
