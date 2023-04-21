import Tooltip from '@material-ui/core/Tooltip';
import { getScale } from '../utils';

function ColoredCell({
  scoreValue,
  onClick,
  rounded = true,
  globalScore,
  cell,
  isAssociations = true,
  hasValue = false,
}) {
  // if(!hasValue) return null
  const colorScale = getScale(isAssociations);

  const onClickHabdler = onClick ? () => onClick(cell) : () => {};
  const backgroundColor = hasValue ? colorScale(scoreValue) : '#fafafa';
  const borderColor = hasValue ? colorScale(scoreValue) : '#e0dede';
  const className = globalScore
    ? 'data-global-score'
    : hasValue
    ? 'data-score'
    : 'data-empty';
  const scoreText = hasValue ? `Score: ${scoreValue.toFixed(2)}` : 'No data';

  const style = {
    height: '26px',
    width: rounded ? '26px' : '30px',
    borderRadius: rounded ? '13px' : 0,
    backgroundColor,
    border: `1px solid ${borderColor}`,
  };

  return (
    <Tooltip title={scoreText} arrow disableHoverListener={false}>
      <div className={className} onClick={onClickHabdler} style={style}></div>
    </Tooltip>
  );
}

export default ColoredCell;
