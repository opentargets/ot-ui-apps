import { Skeleton, styled } from "@mui/material";
import Tooltip from "./AssocTooltip";
import { cellHasValue, getColumAndSection } from "../../utils";
import {
  useAssociationsFocus,
  useAssociationsFocusDispatch,
} from "../../context/AssociationsFocusContext";

const ScoreElement = styled("div", {
  shouldForwardProp: prop =>
    prop !== "borderColor" && prop !== "backgroundColor" && prop !== "shape" && prop !== "active",
})(
  ({
    backgroundColor = "var(--background-color)",
    borderColor = "var(--grey-mid)",
    shape,
    active = false,
  }) => ({
    background: backgroundColor.toString(),
    border: active ? `1px solid ${borderColor}` : `1px solid ${borderColor}`,
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
  })
);

const defaultCell = {
  getValue: () => false,
  table: {
    getState: () => ({ prefix: "", loading: false }),
  },
};

function TableCell({ shape = "circular", cell = defaultCell, colorScale, displayedTable }) {
  const { prefix, loading, parentTable, parentRow } = cell.table.getState();
  const dispatch = useAssociationsFocusDispatch();
  const cellValue = cell.getValue();
  const hasValue = cellHasValue(cellValue);
  const borderColor = hasValue ? colorScale(cellValue) : "#e0dede";
  const backgroundColor = hasValue ? colorScale(cellValue) : "#fafafa";
  // const onClickHandler = onClick ? () => onClick(cell, prefix) : () => ({});

  const focusState = useAssociationsFocus();

  // const active =
  //   prefix !== "interactors"
  //     ? focusState.find(e => e.table === prefix && e.section !== null)?.section ===
  //       getColumAndSection(cell, displayedTable)
  //     : focusState.find(
  //         e => e.row === parentRow && e.table === parentTable && e.interactorsSection !== null
  //       )?.interactorsSection;

  const onClickHandler = () => {
    if (prefix === "interactors")
      return dispatch({
        type: "SET_INTERACTORS_SECTION",
        focus: {
          table: parentTable,
          row: parentRow,
          interactorsRow: cell.row.id,
          section: getColumAndSection(cell, displayedTable),
        },
      });
    return dispatch({
      type: "SET_FOCUS_SECTION",
      focus: {
        table: prefix,
        row: cell.row.id,
        section: getColumAndSection(cell, displayedTable),
      },
    });
  };

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
        onClick={() => onClickHandler()}
        shape={shape}
        // active={active}
      />
    </Tooltip>
  );
}

export default TableCell;
