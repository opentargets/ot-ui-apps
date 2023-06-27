import { useState, useEffect } from 'react';
import { v1 } from 'uuid';
import {
  AddCircleOutlineRounded,
  RemoveCircleOutlineRounded,
} from '@material-ui/icons';
import { faCircleNodes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button, makeStyles, Typography } from '@material-ui/core';

import { naLabel } from '../../../constants';
import SentenceMatch from './SentenceMatch';
import SimplePublication from '../../common/Bibliography/SimplePublication';
import { publicationSummaryQuery } from '../../../utils/urls';
import SummaryLoader from '../../../components/PublicationsDrawer/SummaryLoader';
import config from '../../../config';

const useStyles = makeStyles(theme => ({
  abstractSpan: {
    whiteSpace: 'normal',
  },
  detailsButton: {
    // margin: '1rem',
  },
  detailPanel: {
    background: `${theme.palette.grey[100]}`,
    marginTop: '10px',
    padding: '20px',
  },
  matchTable: {
    width: '100%',
  },
  btnsContainer: {
    marginTop: '1rem',
    marginBottom: '1rem',
    display: 'flex',
    gap: '2rem',
  },
}));

function Publication({
  europePmcId,
  title,
  abstract,
  textMiningSentences,
  authors,
  journal,
  source = 'MED',
  patentDetails = null,
  isOpenAccess,
  symbol,
  name,
  pmcId,
}) {
  const classes = useStyles();
  const [showAbstract, setShowAbstract] = useState(false);
  const [showMatches, setShowMatches] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryText, setSummaryText] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { urlAiApi } = config;

  if (!title) {
    return { naLabel };
  }

  const handleShowAbstractClick = () => {
    setShowAbstract(current => !current);
  };

  const handleShowMatchesClick = () => {
    setShowMatches(current => !current);
  };

  const handleShowSummaryClick = () => {
    setShowSummary(current => !current);
  };

  function requestSummary({ baseUrl, requestOptions }) {
    fetch(baseUrl, requestOptions)
      .then(response => {
        if (response.ok) return response.json();
        const errorText = response.statusText;
        throw new Error(errorText);
      })
      .then(data => {
        setSummaryText(data.text);
        setError(null);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }

  const onClickRetry = () => {
    setLoading(true);
    const { baseUrl, body } = publicationSummaryQuery({
      pmcId,
      symbol,
      name,
    });
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ payload: body.payload }),
    };
    requestSummary({ baseUrl, requestOptions });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { baseUrl, body } = publicationSummaryQuery({
        pmcId,
        symbol,
        name,
      });
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payload: body.payload }),
      };
      requestSummary({ baseUrl, requestOptions });
    };
    if (showSummary && summaryText === null) {
      fetchData();
    }
  }, [showSummary]);

  useEffect(() => {
    setShowAbstract(false);
    setShowMatches(false);
    setShowSummary(false);
    setSummaryText(null);
  }, [title]);

  return (
    <Box>
      <SimplePublication
        pmId={europePmcId}
        titleHtml={title}
        authors={authors}
        source={source}
        patentDetails={patentDetails}
        journal={{
          title: journal?.journal?.title,
          date: journal?.yearOfPublication?.toString(),
          ref: {
            volume: journal.volume,
            issue: journal.issue,
            pgn: journal.page || naLabel,
          },
        }}
      />
      <div className={classes.btnsContainer}>
        {isOpenAccess && urlAiApi && (
          <Button
            className={classes.detailsButton}
            variant="outlined"
            size="small"
            startIcon={<FontAwesomeIcon icon={faCircleNodes} size="sm" />}
            onClick={handleShowSummaryClick}
          >
            {showSummary ? 'Hide summary' : 'Show summary'}
          </Button>
        )}
        {abstract && (
          <Button
            className={classes.detailsButton}
            variant="outlined"
            size="small"
            startIcon={
              showAbstract ? (
                <RemoveCircleOutlineRounded />
              ) : (
                <AddCircleOutlineRounded />
              )
            }
            onClick={handleShowAbstractClick}
          >
            {showAbstract ? 'Hide abstract' : 'Show abstract'}
          </Button>
        )}
        {textMiningSentences && (
          <Button
            className={classes.detailsButton}
            variant="outlined"
            size="small"
            startIcon={
              showMatches ? (
                <RemoveCircleOutlineRounded />
              ) : (
                <AddCircleOutlineRounded />
              )
            }
            onClick={handleShowMatchesClick}
          >
            {showMatches
              ? 'Hide match details'
              : `Show ${textMiningSentences.length} match details`}
          </Button>
        )}
      </div>
      <Box>
        {showSummary && (
          <Box className={classes.detailPanel}>
            {loading && <SummaryLoader />}
            {!loading && error && (
              <>
                <span className={classes.abstractSpan}>
                  <b>Error: </b>
                  {error}
                </span>
                <br />
                <br />
                <button type="button" onClick={onClickRetry}>
                  Retry request
                </button>
              </>
            )}
            {!loading && !error && (
              <>
                <Typography variant="subtitle2">Evidence summary</Typography>
                <span className={classes.abstractSpan}>{summaryText}</span>
              </>
            )}
          </Box>
        )}
        {showAbstract && (
          <Box className={classes.detailPanel}>
            <Typography variant="subtitle2">Abstract</Typography>
            <span className={classes.abstractSpan}>{abstract}</span>
          </Box>
        )}
        {showMatches && (
          <Box className={classes.detailPanel}>
            <Typography variant="subtitle2">Matches</Typography>
            <table className={classes.matchTable}>
              <tbody>
                {textMiningSentences.map(match => (
                  <SentenceMatch key={v1()} match={match} />
                ))}
              </tbody>
            </table>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Publication;
