import { Skeleton, styled } from "@mui/material";
import Tooltip from "./AssocTooltip";
import { cellHasValue, getColumAndSection, TABLE_PREFIX } from "../../utils";
import {
  FocusActionType,
  useAssociationsFocus,
  useAssociationsFocusDispatch,
} from "../../context/AssociationsFocusContext";
import { grey } from "@mui/material/colors";

const ScoreElement = styled("div", {
  shouldForwardProp: prop =>
    prop !== "borderColor" && prop !== "backgroundColor" && prop !== "shape" && prop !== "active",
})(
  ({
    backgroundColor = "var(--background-color)",
    borderColor = "red",
    shape,
    active = false,
    theme,
  }) => ({
    background: backgroundColor.toString(),
    border: active ? `2px solid #2a2c30` : `1px solid ${borderColor}`,
    borderRadius: shape === "circular" ? "50%" : 0,
    height: "24px",
    width: "24px",
    boxSizing: "border-box",
    boxShadow: active ? theme.shadows[4] : "none",
    transition: "all 150ms ease",
    "&:hover": {
      cursor: "pointer",
      boxShadow: theme.shadows[2],
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
  const borderColor = hasValue ? colorScale(cellValue) : grey[300];
  const backgroundColor = hasValue ? colorScale(cellValue) : "#fafafa";

  const focusState = useAssociationsFocus();

  const active =
    prefix !== TABLE_PREFIX.INTERACTORS
      ? !!focusState.find(
          e =>
            e.table === prefix &&
            e.row === cell?.row?.id &&
            e.section &&
            e.section[0] === cell?.column?.id
        )
      : !!focusState.find(
          e =>
            e.table === parentTable &&
            e.row === parentRow &&
            e.interactorsRow === cell?.row?.id &&
            e.interactorsSection &&
            e.interactorsSection[0] === cell?.column?.id
        );

  const onClickHandler = () => {
    if (cell.column.id === "score") return;
    if (prefix === TABLE_PREFIX.INTERACTORS)
      return dispatch({
        type: FocusActionType.SET_INTERACTORS_SECTION,
        focus: {
          table: parentTable,
          row: parentRow,
          interactorsRow: cell.row.id,
          section: getColumAndSection(cell, displayedTable),
        },
      });
    return dispatch({
      type: FocusActionType.SET_FOCUS_SECTION,
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
        active={active}
      />
    </Tooltip>
  );
}

export default TableCell;
