import { Skeleton, styled } from "@mui/material";
import Tooltip from "./AssocTooltip";
import { cellHasValue } from "../../utils";

const ScoreElement = styled("div", {
  shouldForwardProp: prop =>
    prop !== "borderColor" && prop !== "backgroundColor" && prop !== "shape",
})(({ backgroundColor = "var(--background-color)", borderColor = "var(--grey-mid)", shape }) => ({
  background: backgroundColor.toString(),
  border: `1px solid ${borderColor}`,
  borderRadius: shape === "circular" ? "50%" : 0,
  height: "24px",
  width: "24px",
  boxSizing: "border-box",
  "&:hover": {
    cursor: "pointer",
    boxShadow: "0px 0px 3px 1px rgba(0, 0, 0, 0.35)",
  },
  "@media only screen and (max-width: 1050px)": {
    height: "20px",
    width: "20px",
  },
}));

const defaultCell = {
  getValue: () => false,
  table: {
    getState: () => ({ prefix: "", loading: false }),
  },
};

function TableCell({ onClick, shape = "circular", cell = defaultCell, colorScale }) {
  const { prefix, loading } = cell.table.getState();
  const cellValue = cell.getValue();
  const hasValue = cellHasValue(cellValue);
  const borderColor = hasValue ? colorScale(cellValue) : "#e0dede";
  const backgroundColor = hasValue ? colorScale(cellValue) : "#fafafa";
  const onClickHandler = onClick ? () => onClick(cell, prefix) : () => ({});

  if (loading) return <Skeleton variant={shape} width={25} height={25} />;

  if (!hasValue)
    return (
      <Tooltip title="No data" arrow disableHoverListener={false}>
        <ScoreElement backgroundColor={backgroundColor} borderColor={borderColor} shape={shape} />
      </Tooltip>
    );

  const scoreText = `Score: ${cellValue.toFixed(2)}`;

  return (
    <Tooltip title={scoreText} arrow disableHoverListener={false}>
      <ScoreElement
        backgroundColor={backgroundColor}
        borderColor={borderColor}
        onClick={onClickHandler}
        shape={shape}
      />
    </Tooltip>
  );
}

export default TableCell;
