import { useEffect, useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Box, Typography, Button } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import { faCircleNodes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import config from '../../config';

type LoadingState = true | false;
type CollapsedState = true | false;
type TextState = string | null;
type PublicationSummaryProps = {
  pmcId: string;
  symbol: string;
  name: string;
};

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

const publicationSummaryQuery = ({
  pmcId,
  symbol,
  name,
}: PublicationSummaryProps) => {
  const baseUrl = `${config.urlAiApi}/literature/publication/summary`;
  const body = {
    payload: {
      pmcId,
      targetSymbol: symbol,
      diseaseName: name,
    },
  };

  return { baseUrl, body };
};

function PublicationSummary({
  pmcId,
  symbol,
  name,
}: PublicationSummaryProps): JSX.Element {
  const [loading, setLoading] = useState<LoadingState>(false);
  const [text, setText] = useState<TextState>(null);
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
          setText(data.text);
          setLoading(false);
        });
    };
    if (collapseOpen) {
      fetchData();
    }
  }, [collapseOpen]);

  return (
    <div>
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
      <Collapse in={collapseOpen}>
        <Box className={classes.detailPanel}>
          <Typography variant="subtitle2">Summary</Typography>
          {loading && <div>Loading ...</div>}
          {!loading && <span className={classes.summarySpan}>{text}</span>}
        </Box>
      </Collapse>
    </div>
  );
}

export default PublicationSummary;
