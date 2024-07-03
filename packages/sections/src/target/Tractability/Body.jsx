import { faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { v1 } from "uuid";
import { SectionItem, EllsWrapper } from "ui";
import classNames from "classnames";
import { useQuery } from "@apollo/client";
import { Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { definition } from ".";
import Description from "./Description";
import TRACTABILITY_QUERY from "./TractabilityQuery.gql";

const useStyles = makeStyles(theme => ({
  modality: {
    marginBottom: "0.35em",
  },
  modalityEnabled: {
    fontWeight: "bold",
  },
  modalityDisabled: {
    color: theme.palette.grey[300],
  },
  modalityIcon: {
    paddingRight: "0.5em",
    float: "left",
  },
  modalityIconEnabled: {
    color: theme.palette.primary.main,
  },
}));

const modalities = [
  {
    modality: "SM",
    label: "Small molecule",
  },
  {
    modality: "AB",
    label: "Antibody",
  },
  {
    modality: "PR",
    label: "PROTAC",
  },
  {
    modality: "OC",
    label: "Other modalities",
  },
];

/**
 * Parse given data for the specified modality and return a list (divs)
 * @param {String} modality e.g. 'SM'
 * @param {Array} data the tractability data array returned by the API {value, modality, label(id)}
 * @returns
 */
function ModalityList({ modality, data }) {
  const classes = useStyles();
  return (
    <>
      {data
        .filter(d => d.modality === modality)
        .map(d => (
          <div
            key={v1()}
            className={classNames(
              classes.modality,
              d.value ? classes.modalityEnabled : classes.modalityDisabled
            )}
          >
            <EllsWrapper title={d.label}>
              <span
                className={classNames(classes.modalityIcon, {
                  [classes.modalityIconEnabled]: d.value,
                })}
              >
                <FontAwesomeIcon icon={d.value ? faCheckCircle : faTimesCircle} size="lg" />
              </span>
              {d.label}
            </EllsWrapper>
          </div>
        ))}
    </>
  );
}

function Body({ label: symbol, id: ensemblId, entity }) {
  // const request = usePlatformApi(Summary.fragments.TractabilitySummaryFragment);

  const request = useQuery(TRACTABILITY_QUERY, {
    variables: { ensemblId },
  });

  return (
    <SectionItem
      definition={definition}
      request={request}
      entity={entity}
      renderDescription={() => <Description symbol={symbol} />}
      renderBody={data => (
        <Grid container spacing={3}>
          {modalities.map(m => (
            <Grid item xs={6} sm={3} key={v1()}>
              <Typography variant="subtitle1" gutterBottom>
                {m.label}
              </Typography>
              <ModalityList modality={m.modality} data={data.target.tractability} />
            </Grid>
          ))}
        </Grid>
      )}
    />
  );
}

export default Body;
