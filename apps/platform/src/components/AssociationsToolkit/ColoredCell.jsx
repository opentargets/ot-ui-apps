import Tooltip from '@material-ui/core/Tooltip';
import { getScale } from './utils';

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
