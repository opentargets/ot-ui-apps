import Tooltip from '@material-ui/core/Tooltip';
import { getScale } from '../utils';
import { EventHandler, MouseEvent } from 'react';

type SquareCellProps = {
  scoreValue: number;
  onClick: void;
  rounded: boolean;
  globalScore: boolean;
  cell: object;
  isAssociations: boolean;
  hasValue: boolean;
  empty: boolean;
};

function SquaredCell({
  scoreValue,
  onClick,
  empty,
  globalScore,
  cell,
  isAssociations = true,
  hasValue = false,
}: SquareCellProps) {
  // if(!hasValue) return null
  const colorScale = getScale(isAssociations);

  // const onClickHabdler = onClick ? () => onClick(cell) : () => {};
  const onClickHabdler = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (empty) return;
    return onClick(cell);
  };
  const backgroundColor = !empty ? colorScale(scoreValue) : '#fff';
  const borderColor = hasValue ? colorScale(scoreValue) : '#e0dede';
  const className = globalScore
    ? 'data-global-score'
    : hasValue
    ? 'data-score'
    : 'data-empty';
  const scoreText = hasValue ? `Score: ${scoreValue.toFixed(2)}` : 'No data';

  const style = {
    height: '36px',
    width: '100%',
    backgroundColor,
    border: `2.5px solid #FAFAFF`,
  };

  return (
    <Tooltip title={scoreText} arrow disableHoverListener={false}>
      <div className={className} onClick={onClickHabdler} style={style}></div>
    </Tooltip>
  );
}

export default SquaredCell;
