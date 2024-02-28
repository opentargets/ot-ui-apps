import { getScale } from "../utils";
import Tooltip from "./AssocTooltip";

const getClassName = ({ globalScore, hasValue }) => {
  if (globalScore) return "data-global-score";
  if (hasValue) return "data-score";
  return "data-empty";
};

function ColoredCell({
  scoreValue,
  onClick,
  rounded = true,
  globalScore,
  cell,
  isAssociations = true,
  hasValue = false,
  tablePrefix = null,
  colorScale,
}) {
  const onClickHandler = onClick ? () => onClick(cell, tablePrefix) : () => ({});
  const backgroundColor = hasValue ? colorScale(scoreValue) : "#fafafa";
  const borderColor = hasValue ? colorScale(scoreValue) : "#e0dede";
  const className = getClassName({ globalScore, hasValue });
  const scoreText = hasValue ? `Score: ${scoreValue.toFixed(2)}` : "No data";

  const style = {
    height: "24px",
    width: "24px",
    borderRadius: rounded ? "50%" : 0,
    backgroundColor,
    border: `1px solid ${borderColor}`,
  };

  return (
    <Tooltip title={scoreText} arrow disableHoverListener={false}>
      <div className={className} onClick={onClickHandler} style={style} />
    </Tooltip>
  );
}

export default ColoredCell;
