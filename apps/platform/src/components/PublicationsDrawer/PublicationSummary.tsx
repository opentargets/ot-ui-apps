import { useEffect, useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Box, Typography, Button } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import { faCircleNodes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { publicationSummaryQuery } from '../../utils/urls';
import PublicationActionsTooltip from './PublicationActionsTooltip';
import SummaryLoader from './SummaryLoader';

type LoadingState = true | false;
type CollapsedState = true | false;
type TextState = string | null;
type PublicationSummaryProps = {
  pmcId: string;
  symbol: string;
  name: string;
};

const helpText =
  "Evidence summarisation based on the available full-text article. Free-to-use full-text article provided by Europe PMC and summarised using OpenAI's gpt-3.5-turbo model.";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fileLabel: {
      cursor: 'pointer',
      color: '#5a5f5f',
      fontSize: '0.875rem',
      fontFamily: '"Inter", "sans-serif"',
    },
    detailPanel: {
      background: `${theme.palette.grey[100]}`,
      marginTop: '10px',
      padding: '20px',
    },
    summarySpan: {
      whiteSpace: 'normal',
    },
    detailsButton: {
      margin: '0 ',
    },
  })
);

function PublicationSummary({
  pmcId,
  symbol,
  name,
}: PublicationSummaryProps): JSX.Element {
  const [loading, setLoading] = useState<LoadingState>(false);
  const [summaryText, setSummaryText] = useState<TextState>(null);
  const [collapseOpen, setCollapseOpen] = useState<CollapsedState>(false);
  const classes = useStyles();

  const handleChange = () => {
    setCollapseOpen(prev => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { baseUrl, body } = publicationSummaryQuery({
        pmcId,
        symbol,
        name,
      });
      const requestOptions: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payload: body.payload }),
      };
      fetch(baseUrl, requestOptions)
        .then(response => response.json())
        .then(data => {
          setSummaryText(data.text);
          setLoading(false);
        });
    };
    if (collapseOpen && summaryText === null) {
      fetchData();
    }
  }, [collapseOpen]);

  return (
    <div>
      <PublicationActionsTooltip title={helpText} placement="top">
        <Button
          className={classes.detailsButton}
          variant="outlined"
          size="small"
          onClick={() => {
            handleChange();
          }}
          startIcon={<FontAwesomeIcon icon={faCircleNodes} size="sm" />}
        >
          Show summary
        </Button>
      </PublicationActionsTooltip>
      <Collapse in={collapseOpen}>
        <Box className={classes.detailPanel}>
          {loading && <SummaryLoader />}
          {!loading && (
            <>
              <Typography variant="subtitle2">Evidence summary</Typography>
              <span className={classes.summarySpan}>{summaryText}</span>
            </>
          )}
        </Box>
      </Collapse>
    </div>
  );
}

export default PublicationSummary;
