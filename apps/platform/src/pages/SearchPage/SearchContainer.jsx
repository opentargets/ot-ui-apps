import {
  Grid,
  Card,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
  TablePagination,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDna, faPrescriptionBottleAlt, faStethoscope } from "@fortawesome/free-solid-svg-icons";
import { ErrorBoundary } from "ui";

import DiseaseDetail from "./DiseaseDetail";
import DiseaseResult from "./DiseaseResult";
import DrugDetail from "./DrugDetail";
import DrugResult from "./DrugResult";
import TargetDetail from "./TargetDetail";
import TargetResult from "./TargetResult";

const getCounts = entities => {
  const counts = {
    target: 0,
    disease: 0,
    drug: 0,
  };

  entities.forEach(entity => {
    counts[entity.name] = entity.total;
  });

  return counts;
};

const useStyles = makeStyles(theme => ({
  label: {
    marginLeft: "-6px",
  },
  labelIcon: {
    color: theme.palette.primary.main,
    marginRight: "2px",
  },
}));

const SearchFilters = ({ entities, entitiesCount, setEntity }) => {
  const counts = getCounts(entitiesCount);
  const classes = useStyles();

  return (
    <>
      <FormControlLabel
        className={classes.label}
        control={<Checkbox checked={entities.includes("target")} onChange={setEntity("target")} />}
        label={
          <>
            <FontAwesomeIcon icon={faDna} fixedWidth className={classes.labelIcon} />
            <Typography variant="body2" display="inline">
              Target ({counts.target})
            </Typography>
          </>
        }
      />
      <FormControlLabel
        className={classes.label}
        control={
          <Checkbox checked={entities.includes("disease")} onChange={setEntity("disease")} />
        }
        label={
          <>
            <FontAwesomeIcon icon={faStethoscope} fixedWidth className={classes.labelIcon} />
            <Typography variant="body2" display="inline">
              Disease or phenotype ({counts.disease})
            </Typography>
          </>
        }
      />
      <FormControlLabel
        className={classes.label}
        control={<Checkbox checked={entities.includes("drug")} onChange={setEntity("drug")} />}
        label={
          <>
            <FontAwesomeIcon
              icon={faPrescriptionBottleAlt}
              fixedWidth
              className={classes.labelIcon}
            />
            <Typography variant="body2" display="inline">
              Drug ({counts.drug})
            </Typography>
          </>
        }
      />
    </>
  );
};

function SearchResults({ results, page, onPageChange }) {
  const TYPE_NAME = "__typename";
  return (
    <>
      <TablePagination
        component="div"
        rowsPerPageOptions={[]}
        rowsPerPage={10}
        count={results.total}
        page={page - 1}
        onPageChange={onPageChange}
      />
      {results.hits.map(({ highlights, object }) => {
        if (object[TYPE_NAME] === "Target")
          return <TargetResult key={object.id} data={object} highlights={highlights} />;
        if (object[TYPE_NAME] === "Disease")
          return <DiseaseResult key={object.id} data={object} highlights={highlights} />;
        return <DrugResult key={object.id} data={object} highlights={highlights} />;
      })}

      <TablePagination
        component="div"
        rowsPerPageOptions={[]}
        rowsPerPage={10}
        count={results.total}
        page={page - 1}
        onPageChange={onPageChange}
      />
    </>
  );
}

function TopHitDetail({ topHit }) {
  let COMPONENT = null;
  const TYPE_NAME = "__typename";
  if (topHit[TYPE_NAME] === "Target") COMPONENT = <TargetDetail data={topHit} />;
  else if (topHit[TYPE_NAME] === "Disease") COMPONENT = <DiseaseDetail data={topHit} />;
  else if (topHit[TYPE_NAME] === "Drug") COMPONENT = <DrugDetail data={topHit} />;
  return (
    <Card elevation={0}>
      <ErrorBoundary>{COMPONENT}</ErrorBoundary>
    </Card>
  );
}

function SearchContainer({ q, page, entities, data, onPageChange, onSetEntity }) {
  const { entities: entitiesCount } = data.search.aggregations;
  const topHit = data.topHit.hits[0]?.object;

  return (
    <>
      <Typography variant="h5" gutterBottom>
        {data.search.total} results for &quot;<strong>{q}</strong>&quot;
      </Typography>
      <Grid container spacing={2}>
        <Grid item md={2}>
          <Typography variant="body2">Refine by:</Typography>
          <FormGroup>
            <SearchFilters
              entities={entities}
              entitiesCount={entitiesCount}
              setEntity={onSetEntity}
            />
          </FormGroup>
        </Grid>
        <Grid item md={7}>
          {data.search.hits.length > 0 ? (
            <SearchResults page={page} results={data.search} onPageChange={onPageChange} />
          ) : null}
        </Grid>
        <Grid item md={3}>
          {topHit ? <TopHitDetail topHit={topHit} /> : null}
        </Grid>
      </Grid>
    </>
  );
}

export default SearchContainer;
