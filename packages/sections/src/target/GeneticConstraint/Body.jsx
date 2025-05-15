import { makeStyles } from "@mui/styles";
import { useQuery } from "@apollo/client";
import { SectionItem, Link, Tooltip, OtTable } from "ui";

import { definition } from ".";
import Description from "./Description";
import upperBin6Map from "./upperBin6Map";
import GENETIC_CONSTRAINT from "./GeneticConstraint.gql";

const useStyles = makeStyles(theme => ({
  filled: {
    display: "inline-block",
    border: "1px solid black",
    backgroundColor: theme.palette.primary.main,
    height: "16px",
    width: "16px",
    borderRadius: "50%",
    marginRight: "3px",
  },
  notFilled: {
    display: "inline-block",
    border: "1px solid black",
    height: "16px",
    width: "16px",
    borderRadius: "50%",
    marginRight: "3px",
  },
  title: {
    display: "inline-block",
    marginTop: "11px",
  },
}));

const constraintTypeMap = {
  syn: "Synonymous",
  mis: "Missense",
  lof: "pLoF",
};

function ConstraintAssessment({ ensemblId, symbol, upperBin6 }) {
  const classes = useStyles();
  const circles = [];

  for (let i = 0; i < 5; i++) {
    circles.push(
      <span key={i} className={5 - upperBin6 > i ? classes.filled : classes.notFilled} />
    );
  }

  return (
    <>
      <Tooltip
        title={`Binned representation of ${symbol} rank in the loss-function observed/expected upper bound fraction (LOEUF) distribution. Higher scored assessments correspond to strong selection against predicted loss-of-function (pLoF) variation in the particular gene.`}
        showHelpIcon
      >
        <span className={classes.title}>Constraint assessment</span>
      </Tooltip>

      <div>{circles}</div>
      <Link external to={`https://gnomad.broadinstitute.org/gene/${ensemblId}`}>
        {5 - upperBin6}/5 {upperBin6Map[upperBin6]}
      </Link>
    </>
  );
}

function getColumns(ensemblId, symbol) {
  return [
    {
      id: "constraintType",
      label: "Category",
      enableHiding: false,
      renderCell: ({ constraintType }) => constraintTypeMap[constraintType],
    },
    {
      id: "exp",
      label: "Expected SNVs",
    },
    {
      id: "obs",
      label: "Observed SNVs",
    },
    {
      id: "metrics",
      label: "Constraint metrics",
      renderCell: ({ score, oe, oeLower, oeUpper, upperBin6 }) => (
        <>
          <div>
            {upperBin6 === null ? "Z" : "pLI"} = {score}
          </div>
          <div>
            o/e = {oe} ({oeLower} - {oeUpper})
          </div>
          {upperBin6 === null ? null : (
            <ConstraintAssessment ensemblId={ensemblId} symbol={symbol} upperBin6={upperBin6} />
          )}
        </>
      ),
    },
  ];
}

function Body({ id: ensemblId, label: symbol, entity }) {
  const variables = { ensemblId };
  const request = useQuery(GENETIC_CONSTRAINT, { variables: { ensemblId } });
  return (
    <SectionItem
      definition={definition}
      request={request}
      entity={entity}
      renderDescription={() => <Description symbol={symbol} />}
      renderBody={() => (
        <OtTable
          dataDownloader
          columns={getColumns(ensemblId, symbol)}
          rows={request.data?.target.geneticConstraint}
          query={GENETIC_CONSTRAINT.loc.source.body}
          variables={variables}
          loading={request.loading}
        />
      )}
    />
  );
}

export default Body;
