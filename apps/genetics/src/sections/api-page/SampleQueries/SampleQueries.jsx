import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import STUDY_INFO from './StudyInfo.gql';

const useStyles = makeStyles({
  buttonMargin: {
    marginBottom: '12px',
  },
});

function SampleQueries({ setQuery }) {
  const classes = useStyles();
  return (
    <>
      <Typography variant="h5" paragraph>
        Example queries
      </Typography>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2">
            Target-disease association
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <Typography variant="subtitle2" display="block" paragraph>
              Find targets associated with a specific disease or phenotype
            </Typography>
            <Button
              className={classes.buttonMargin}
              variant="contained"
              color="primary"
              onClick={() => setQuery(STUDY_INFO.loc.source.body)}
            >
              Run sample query
            </Button>
            <Typography variant="subtitle2" display="block" paragraph>
              Find diseases and phenotypes associated with a specific target
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setQuery(STUDY_INFO.loc.source.body)}
            >
              Run sample query
            </Button>
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2">Target-disease evidence</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <Typography variant="subtitle2" display="block" paragraph>
              Explore evidence that supports a specific target-disease
              association
            </Typography>
            <Button
              className={classes.buttonMargin}
              variant="contained"
              color="primary"
              onClick={() => setQuery(STUDY_INFO.loc.source.body)}
            >
              Run sample query
            </Button>
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2">Target annotation</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <Typography variant="subtitle2" display="block" paragraph>
              Find tractability and safety information for a specific target
            </Typography>
            <Button
              className={classes.buttonMargin}
              variant="contained"
              color="primary"
              onClick={() => setQuery(STUDY_INFO.loc.source.body)}
            >
              Run sample query
            </Button>
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2">Disease annotation</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <Typography variant="subtitle2" display="block" paragraph>
              Find clinical signs and symptoms for a specific disease
            </Typography>
            <Button
              className={classes.buttonMargin}
              variant="contained"
              color="primary"
              onClick={() => setQuery(STUDY_INFO.loc.source.body)}
            >
              Run sample query
            </Button>
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2">Drug annotation</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <Typography variant="subtitle2" display="block" paragraph>
              Find approval status and withdrawn and black-box warning for a
              specific drug
            </Typography>
            <Button
              className={classes.buttonMargin}
              variant="contained"
              color="primary"
              onClick={() => setQuery(STUDY_INFO.loc.source.body)}
            >
              Run sample query
            </Button>
          </div>
        </AccordionDetails>
      </Accordion>
    </>
  );
}

export default SampleQueries;
