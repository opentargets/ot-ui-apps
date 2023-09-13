import { scaleQuantize } from 'd3';
import { makeStyles } from '@mui/styles';
import { Link } from 'ui';
import { colorRange } from '../constants';

const color = scaleQuantize().domain([0, 1]).range(colorRange);

const useStyles = makeStyles({
  root: {
    display: 'block',
    height: '20px',
    border: '1px solid #eeefef',
  },
});

function AssocCell({ score, ensemblId, efoId }) {
  const classes = useStyles();
  return (
    <Link to={`/evidence/${ensemblId}/${efoId}`}>
      <span
        className={classes.root}
        title={score ? `Score: ${score.toFixed(2)}` : 'No data'}
        style={{ backgroundColor: color(score) }}
      />
    </Link>
  );
}

export default AssocCell;
