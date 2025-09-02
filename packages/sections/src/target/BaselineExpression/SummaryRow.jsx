import { useState } from "react";
import classNames from "classnames";
import { TableCell, TableRow } from "@mui/material";
import { makeStyles } from "@mui/styles";

const proteinLevel = level => {
  if (level === 0) {
    return "Under expressed";
  }
  if (level === 1) {
    return "Low";
  }
  if (level === 2) {
    return "Medium";
  }
  return "High";
};

const rnaValueToPercent = (maxRnaValue, value) => (value * 100) / maxRnaValue;

const proteinLevelToPercent = level => (level * 100) / 3;

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
  rnaCell: {
    paddingRight: "8px",
  },
  proteinCell: {
    paddingLeft: "8px",
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
  barTissue: {
    backgroundColor: theme.palette.primary.light,
    height: "12px",
  },
}));

function SummaryRow({ parent, maxRnaValue }) {
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
        <TableCell className={classNames(classes.cell, classes.rnaCell)}>
          <div className={classes.barContainer}>
            {parent.maxRnaLevel >= 0 ? (
              <div
                className={classes.barParent}
                title={`${parent.maxRnaValue} (normalized count)`}
                style={{
                  width: `${rnaValueToPercent(maxRnaValue, parent.maxRnaValue)}%`,
                  float: "right",
                }}
              />
            ) : (
              "N/A"
            )}
          </div>
        </TableCell>
        <TableCell className={classNames(classes.cell, classes.proteinCell)}>
          <div className={classes.barContainer}>
            {parent.maxProteinLevel >= 0 ? (
              <div
                className={classes.barParent}
                title={proteinLevel(parent.maxProteinLevel)}
                style={{
                  width: `${proteinLevelToPercent(parent.maxProteinLevel)}%`,
                }}
              />
            ) : (
              "N/A"
            )}
          </div>
        </TableCell>
      </TableRow>
      {parent.tissues.map((tissue, index, tissues) => {
        const rnaPercent = rnaValueToPercent(maxRnaValue, tissue.rna.value);
        const proteinPercent = proteinLevelToPercent(tissue.protein.level);

        return (
          <TableRow
            className={classNames(classes.row, {
              [classes.lastChildRow]: index === tissues.length - 1,
            })}
            key={tissue.tissue.label}
            style={{ display: collapsed ? "none" : "table-row" }}
          >
            <TableCell className={classNames(classes.cell, classes.tissueCell)}>
              {tissue.tissue.label}
            </TableCell>
            <TableCell className={classNames(classes.cell, classes.rnaCell)}>
              <div className={classes.barContainer}>
                {tissue.rna.level >= 0 ? (
                  <div
                    className={classes.barTissue}
                    title={`${tissue.rna.value} (normalized count)`}
                    style={{
                      width: `${rnaPercent}%`,
                      float: "right",
                    }}
                  />
                ) : (
                  "N/A"
                )}
              </div>
            </TableCell>
            <TableCell className={classNames(classes.cell, classes.proteinCell)}>
              <div className={classes.barContainer}>
                {tissue.protein.level >= 0 ? (
                  <div
                    className={classes.barTissue}
                    title={proteinLevel(tissue.protein.level)}
                    style={{
                      width: `${proteinPercent}%`,
                    }}
                  />
                ) : (
                  "N/A"
                )}
              </div>
            </TableCell>
          </TableRow>
        );
      })}
    </>
  );
}

export default SummaryRow;
