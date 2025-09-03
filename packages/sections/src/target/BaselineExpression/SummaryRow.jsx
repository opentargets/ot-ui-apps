import { useState } from "react";
import classNames from "classnames";
import { TableCell, TableRow } from "@mui/material";
import { makeStyles } from "@mui/styles";

const valueToPercent = (maxValue, value) => (value * 100) / maxValue;

const useStyles = makeStyles(theme => ({
  parentRow: {
    height: "20px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: theme.palette.grey[400],
    },
  },
  openedParentRow: {
    borderTop: `1px solid ${theme.palette.grey[400]}`,
    borderLeft: `1px solid ${theme.palette.grey[400]}`,
    borderRight: `1px solid ${theme.palette.grey[400]}`,
  },
  row: {
    height: "24px !important",
    backgroundColor: theme.palette.grey[100],
    borderLeft: `1px solid ${theme.palette.grey[400]}`,
    borderRight: `1px solid ${theme.palette.grey[400]}`,
  },
  lastChildRow: {
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
  },
  cell: {
    border: "none !important",
    width: "230px",
    paddingTop: "0 !important",
    paddingBottom: "0 !important",
  },
  parentTissueCell: {
    fontWeight: "bold !important",
  },
  tissueCell: {
    textTransform: "capitalize",
    paddingRight: "8px",
  },
  medianCell: {
    paddingRight: "8px",
  },
  barContainer: {
    height: "12px",
    backgroundColor: theme.palette.grey[300],
    fontSize: "10px !important",
    textAlign: "center",
  },
  barParent: {
    backgroundColor: theme.palette.primary.main,
    height: "12px",
  },
  barExpression: {
    backgroundColor: theme.palette.primary.light,
    height: "12px",
  },
}));

function SummaryRow({ parent, maxMedianValue }) {
  const [collapsed, setCollapsed] = useState(true);
  const classes = useStyles();

  const handleClick = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      <TableRow
        className={classNames(classes.parentRow, {
          [classes.openedParentRow]: !collapsed,
        })}
        onClick={handleClick}
      >
        <TableCell
          className={classNames(classes.cell, classes.parentTissueCell, classes.tissueCell)}
        >
          {parent.parentLabel}
        </TableCell>
        <TableCell className={classNames(classes.cell)}>
          {/* Cell type will be shown in child rows */}
        </TableCell>
        <TableCell className={classNames(classes.cell, classes.medianCell)}>
          <div className={classes.barContainer}>
            {parent.maxMedian >= 0 ? (
              <div
                className={classes.barParent}
                title={`${parent.maxMedian} (median expression)`}
                style={{
                  width: `${valueToPercent(maxMedianValue, parent.maxMedian)}%`,
                  float: "right",
                }}
              />
            ) : (
              "N/A"
            )}
          </div>
        </TableCell>
        <TableCell className={classNames(classes.cell)}>
          {/* Unit will be shown in child rows */}
        </TableCell>
        <TableCell className={classNames(classes.cell)}>
          {/* Data source will be shown in child rows */}
        </TableCell>
      </TableRow>
      {parent.expressions.map((expression, index, expressions) => {
        const medianPercent = valueToPercent(maxMedianValue, expression.median || 0);

        return (
          <TableRow
            className={classNames(classes.row, {
              [classes.lastChildRow]: index === expressions.length - 1,
            })}
            key={`${expression.tissueBiosample?.biosampleId || expression.tissueBiosampleFromSource}-${expression.celltypeBiosample?.biosampleId || expression.celltypeBiosampleFromSource}`}
            style={{ display: collapsed ? "none" : "table-row" }}
          >
            <TableCell className={classNames(classes.cell, classes.tissueCell)}>
              {expression.tissueBiosample?.biosampleName || expression.tissueBiosampleFromSource || "N/A"}
            </TableCell>
            <TableCell className={classNames(classes.cell)}>
              {expression.celltypeBiosample?.biosampleName || expression.celltypeBiosampleFromSource || "N/A"}
            </TableCell>
            <TableCell className={classNames(classes.cell, classes.medianCell)}>
              <div className={classes.barContainer}>
                {expression.median >= 0 ? (
                  <div
                    className={classes.barExpression}
                    title={`${expression.median} (median expression)`}
                    style={{
                      width: `${medianPercent}%`,
                      float: "right",
                    }}
                  />
                ) : (
                  "N/A"
                )}
              </div>
            </TableCell>
            <TableCell className={classNames(classes.cell)}>
              {expression.unit || "N/A"}
            </TableCell>
            <TableCell className={classNames(classes.cell)}>
              {expression.datasourceId || "N/A"}
            </TableCell>
          </TableRow>
        );
      })}
    </>
  );
}

export default SummaryRow;
