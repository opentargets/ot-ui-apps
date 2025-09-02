import { useState } from "react";
import maxBy from "lodash/maxBy";
import classNames from "classnames";
import {
  Typography,
  Table,
  TableHead,
  TableSortLabel,
  TableBody,
  TableRow,
  TableCell,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

import SummaryRow from "./SummaryRow";

const getMaxRnaValue = expressions => {
  if (expressions.length <= 0) return 0;
  return maxBy(expressions, expression => (expression?.rna ? expression.rna.value : 0)).rna.value;
};

// function that transforms tissue data into an array of objects
// where each object has the following shape and where tissues is
// an array of tissues that belong to the parent category
// {
//   parentLabel: string
//   tissues: []
//   maxRnaValue: number
//   maxRnaLevel: number
//   maxProteinLevel: number
// }
const groupTissues = (expressions, groupBy) => {
  const groupedTissues = {};

  expressions.forEach(expression => {
    const parentLabels = expression.tissue[groupBy];
    parentLabels.forEach(label => {
      if (!groupedTissues[label]) {
        groupedTissues[label] = {
          parentLabel: label,
          tissues: [],
          maxRnaValue: Number.NEGATIVE_INFINITY,
          maxRnaLevel: Number.NEGATIVE_INFINITY,
          maxProteinLevel: Number.NEGATIVE_INFINITY,
        };
      }

      const parent = groupedTissues[label];

      parent.tissues.push(expression);
      parent.maxRnaValue = Math.max(parent.maxRnaValue, expression.rna.value);
      parent.maxRnaLevel = Math.max(parent.maxRnaLevel, expression.rna.level);
      parent.maxProteinLevel = Math.max(parent.maxProteinLevel, expression.protein.level);
    });
  });

  return Object.values(groupedTissues);
};

const tissueComparator = sortBy => {
  if (sortBy === "rna") {
    return (a, b) => b.rna.value - a.rna.value;
  }

  return (a, b) => b.protein.level - a.protein.level;
};

const parentComparator = sortBy => {
  if (sortBy === "rna") {
    return (a, b) => b.maxRnaValue - a.maxRnaValue;
  }

  return (a, b) => b.maxProteinLevel - a.maxProteinLevel;
};

const sort = (parents, sortBy) => {
  parents.forEach(parent => {
    parent.tissues.sort(tissueComparator(sortBy));
  });
  return parents.sort(parentComparator(sortBy));
};

const useStyles = makeStyles({
  groupBy: {
    marginBottom: "20px",
    marginTop: "40px",
  },
  groupByText: {
    marginRight: "7px !important",
  },
  headerCell: {
    textAlign: "center !important",
  },
  rnaCell: {
    paddingRight: "8px",
  },
  proteinCell: {
    paddingLeft: "8px",
  },
  highLow: {
    border: "none !important",
  },
});

function SummaryTable({ data }) {
  const [groupBy, setGroupBy] = useState("organs");
  const [sortBy, setSortBy] = useState("rna");

  const classes = useStyles();
  const maxRnaValue = getMaxRnaValue(data);
  const parents = sort(groupTissues(data, groupBy), sortBy);

  // handlers
  const handleChange = (e, group) => {
    if (group) {
      setGroupBy(group);
    }
  };

  const handleSort = sort => {
    setSortBy(sort);
  };

  return (
    <>
      <Grid className={classes.groupBy} container justifyContent="center" alignItems="center">
        <Typography className={classes.groupByText} variant="body2">
          Group by
        </Typography>
        <ToggleButtonGroup size="small" value={groupBy} exclusive onChange={handleChange}>
          <ToggleButton value="organs">Organs</ToggleButton>
          <ToggleButton value="anatomicalSystems">Anatomical Systems</ToggleButton>
        </ToggleButtonGroup>
      </Grid>
      <Grid container justifyContent="center">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell className={classes.headerCell}>Tissue</TableCell>
              <TableCell className={classes.headerCell} onClick={() => handleSort("rna")}>
                <TableSortLabel direction="desc" active={sortBy === "rna"}>
                  RNA (Expression Atlas)
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerCell} onClick={() => handleSort("protein")}>
                <TableSortLabel direction="desc" active={sortBy === "protein"}>
                  Protein (HPA)
                </TableSortLabel>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.highLow} />
              <TableCell className={classNames(classes.highLow, classes.rnaCell)}>
                <Grid container justifyContent="space-between">
                  <Grid item>High</Grid>
                  <Grid item>Low</Grid>
                </Grid>
              </TableCell>
              <TableCell className={classNames(classes.highLow, classes.proteinCell)}>
                <Grid container justifyContent="space-between">
                  <Grid item>Low</Grid>
                  <Grid item>High</Grid>
                </Grid>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parents.map(parent => (
              <SummaryRow key={parent.parentLabel} maxRnaValue={maxRnaValue} parent={parent} />
            ))}
          </TableBody>
        </Table>
      </Grid>
    </>
  );
}

export default SummaryTable;
