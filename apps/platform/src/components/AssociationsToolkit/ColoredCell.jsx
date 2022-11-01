import { scaleQuantize, scaleLinear, interpolateLab, rgb } from 'd3';
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
const assocScale = scaleQuantize().domain([0, 1]).range(COLORS);

const prioritizationScale = scaleLinear()
  .domain([-1, 0, 1])
  .interpolate(interpolateLab)
  .range([rgb('#AA0F45'), rgb('#FCF7AF'), rgb('#76C6A7')]);
// .range([rgb('#d7191c'), rgb('#ffffbf'), rgb('#a6d96a')]);
// .range([rgb('#BF616A'), rgb('#EBCB8B'), rgb('#A3BE8C')]);

const getScale = isAssoc => (isAssoc ? assocScale : prioritizationScale);

function ColoredCell({
  scoreValue,
  onClick,
  rounded,
  globalScore,
  cell,
  isAssociations = true,
}) {
  const colorScale = getScale(isAssociations);

  const onClickHabdler = onClick ? () => onClick(cell) : () => {};
  const backgroundColor = scoreValue ? colorScale(scoreValue) : '#fafafa';
  const borderColor = scoreValue ? colorScale(scoreValue) : '#e0dede';
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
