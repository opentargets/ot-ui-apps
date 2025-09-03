import { useState } from "react";
import maxBy from "lodash/maxBy";
import classNames from "classnames";
import {
  Table,
  TableHead,
  TableSortLabel,
  TableBody,
  TableRow,
  TableCell,
  Grid,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

import SummaryRow from "./SummaryRow";

const getMaxMedianValue = baselineExpressions => {
  if (baselineExpressions.length <= 0) return 0;
  return maxBy(baselineExpressions, expression => (expression?.median ? expression.median : 0)).median;
};

// function that transforms baseline expression data into an array of objects
// where each object has the following shape and where expressions is
// an array of expressions that belong to the parent category
// {
//   parentLabel: string
//   expressions: []
//   maxMedian: number
// }
const groupTissues = (baselineExpressions, groupBy) => {
  const groupedTissues = {};

  baselineExpressions.forEach(expression => {
    // Use tissueBiosample name as the grouping key
    const tissueName = expression.tissueBiosample?.biosampleName || expression.tissueBiosampleFromSource || "Unknown";
    
    if (!groupedTissues[tissueName]) {
      groupedTissues[tissueName] = {
        parentLabel: tissueName,
        expressions: [],
        maxMedian: Number.NEGATIVE_INFINITY,
      };
    }

    const parent = groupedTissues[tissueName];

    parent.expressions.push(expression);
    parent.maxMedian = Math.max(parent.maxMedian, expression.median || 0);
  });

  return Object.values(groupedTissues);
};

const expressionComparator = sortBy => {
  if (sortBy === "median") {
    return (a, b) => (b.median || 0) - (a.median || 0);
  }
  return (a, b) => (b.median || 0) - (a.median || 0);
};

const parentComparator = sortBy => {
  if (sortBy === "median") {
    return (a, b) => b.maxMedian - a.maxMedian;
  }
  return (a, b) => b.maxMedian - a.maxMedian;
};

const sort = (parents, sortBy) => {
  parents.forEach(parent => {
    parent.expressions.sort(expressionComparator(sortBy));
  });
  return parents.sort(parentComparator(sortBy));
};

const useStyles = makeStyles({
  headerCell: {
    textAlign: "center !important",
  },
});

function SummaryTable({ data }) {
  const [sortBy, setSortBy] = useState("median");

  const classes = useStyles();
  const maxMedianValue = getMaxMedianValue(data);
  const parents = sort(groupTissues(data, "tissue"), sortBy);

  // handlers
  const handleSort = sort => {
    setSortBy(sort);
  };

  return (
    <>
      <Grid container justifyContent="center">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell className={classes.headerCell}>Tissue</TableCell>
              <TableCell className={classes.headerCell}>Cell Type</TableCell>
              <TableCell className={classes.headerCell} onClick={() => handleSort("median")}>
                <TableSortLabel direction="desc" active={sortBy === "median"}>
                  Median Expression
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerCell}>Unit</TableCell>
              <TableCell className={classes.headerCell}>Data Source</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parents.map(parent => (
              <SummaryRow key={parent.parentLabel} maxMedianValue={maxMedianValue} parent={parent} />
            ))}
          </TableBody>
        </Table>
      </Grid>
    </>
  );
}

export default SummaryTable;
