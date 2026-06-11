import { CardContent, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrescriptionBottleAlt } from "@fortawesome/free-solid-svg-icons";

import { LongText, Chip, Link, LongList } from "ui";
import { parseSynonyms } from "@ot/utils";

const useStyles = makeStyles({
  link: {
    display: "block",
  },
  subtitle: {
    fontWeight: 500,
  },
  warningIcon: {
    position: "relative",
    top: "5px",
  },
});

// ChEMBL first, then AACT (names mined from clinical trials)
const DRUG_SYNONYM_SORT_ORDER = ["ChEMBL", "AACT"];

function DrugDetail({ data }) {
  const classes = useStyles();
  const synonyms = parseSynonyms(data.synonyms || [], { sortOrder: DRUG_SYNONYM_SORT_ORDER });
  const tradeNames = parseSynonyms(data.tradeNames || [], { sortOrder: DRUG_SYNONYM_SORT_ORDER });
  return (
    <CardContent>
      <Typography color="primary" variant="h5">
        <Link to={`/drug/${data.id}`}>{data.name}</Link>
      </Typography>
      <Typography color="primary">
        <FontAwesomeIcon icon={faPrescriptionBottleAlt} /> Drug
      </Typography>
      <LongText lineLimit={4}>{data.description}</LongText>

      <Typography className={classes.subtitle} variant="subtitle1">
        Drug Type
      </Typography>
      <Typography variant="body2">{data.drugType}</Typography>
      <Typography className={classes.subtitle} variant="subtitle1">
        Maximum Clinical Stage
      </Typography>
      <Typography variant="body2">{data.maximumClinicalStage}</Typography>
      {data.indications && data.indications.rows.length > 0 && (
        <>
          <Typography className={classes.subtitle} variant="subtitle1">
            Indications
          </Typography>
          <LongList
            terms={data.indications.rows}
            maxTerms={5}
            render={(indication, index) => (
              <Link key={index} className={classes.link} to={`/disease/${indication.disease.id}`}>
                {indication.disease.name}
              </Link>
            )}
          />
        </>
      )}
      {synonyms.length > 0 && (
        <>
          <Typography className={classes.subtitle} variant="subtitle1">
            Synonyms
          </Typography>
          <LongList
            terms={synonyms}
            maxTerms={5}
            render={synonym => (
              <Chip key={synonym.label} title={synonym.tooltip} label={synonym.label} />
            )}
          />
        </>
      )}
      {tradeNames.length > 0 && (
        <>
          <Typography className={classes.subtitle} variant="subtitle1">
            Trade names
          </Typography>
          <LongList
            terms={tradeNames}
            maxTerms={5}
            render={tradeName => (
              <Chip key={tradeName.label} title={tradeName.tooltip} label={tradeName.label} />
            )}
          />
        </>
      )}
    </CardContent>
  );
}

export default DrugDetail;
