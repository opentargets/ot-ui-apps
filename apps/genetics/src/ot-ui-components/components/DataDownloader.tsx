import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import downloadTable, {
  DownloadFormat,
  HeaderMap,
  TableRow,
} from '../helpers/downloadTable';
import { Skeleton } from '@material-ui/lab';

const styles = () => ({
  container: {
    marginBottom: '2px',
  },
  downloadHeader: {
    marginTop: '7px',
  },
  'ml-1': {
    'margin-left': '1em',
  },
});

function handleDownload(
  headers: HeaderMap,
  rows: TableRow[],
  fileStem: string,
  format: DownloadFormat
) {
  downloadTable({
    headerMap: headers,
    rows,
    format,
    filenameStem: fileStem,
  });
}

type DataDownloaderProps = {
  tableHeaders: HeaderMap;
  rows: TableRow[];
  classes: Record<string, string>;
  loading: boolean;
  fileStem: string;
};
function DataDownloader({
  tableHeaders,
  rows,
  classes,
  fileStem,
  loading,
}: DataDownloaderProps) {
  if (loading) {
    return (
      <Grid container justifyContent="flex-end" spacing={1}>
        <Skeleton width="15vw" />
        <Skeleton className={classes['ml-1']} width="6vw" height="6vh" />
        <Skeleton className={classes['ml-1']} width="6vw" height="6vh" />
        <Skeleton className={classes['ml-1']} width="6vw" height="6vh" />
      </Grid>
    );
  }
  return (
    <Grid
      container
      justifyContent="flex-end"
      spacing={1}
      className={classes.container}
    >
      <Grid item>
        <Typography variant="caption" className={classes.downloadHeader}>
          Download table as
        </Typography>
      </Grid>
      <Grid item>
        <Button
          variant="outlined"
          onClick={() => handleDownload(tableHeaders, rows, fileStem, 'json')}
        >
          JSON
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant="outlined"
          onClick={() => handleDownload(tableHeaders, rows, fileStem, 'csv')}
        >
          CSV
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant="outlined"
          onClick={() => handleDownload(tableHeaders, rows, fileStem, 'tsv')}
        >
          TSV
        </Button>
      </Grid>
    </Grid>
  );
}

export default withStyles(styles)(DataDownloader);
