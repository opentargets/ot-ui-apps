import { Link, Tooltip, PublicationsDrawer, TableDrawer, OtTable } from "ui";
import { makeStyles } from "@mui/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleDown, faArrowAltCircleUp } from "@fortawesome/free-solid-svg-icons";

import SafetyStudiesDrawer from "./SafetyStudiesDrawer";
import { naLabel, defaultRowsPerPageOptions } from "../../constants";

const useStyles = makeStyles(theme => ({
  blue: {
    color: theme.palette.primary.main,
  },
  grey: {
    color: theme.palette.grey[300],
  },
  direction: {
    marginBottom: "7px",
  },
  circleUp: {
    marginRight: "10px",
  },
}));

function EffectTooltipContent({ classes, effect }) {
  return (
    <>
      <strong>Direction:</strong>
      <div className={classes.direction}>{effect.direction}</div>
      <strong>Dosing:</strong>
      <div>{effect.dosing}</div>
    </>
  );
}

function getColumns(classes) {
  return [
    {
      id: "event",
      label: "Safety event",
      renderCell: ({ event, eventId }) =>
        eventId ? <Link to={`/disease/${eventId}`}>{event ?? naLabel}</Link> : event ?? naLabel,
    },
    {
      id: "biosamples",
      label: "Biosystems",
      filterValue: ({ biosamples }) => {
        if (biosamples?.length === 1) {
          const sample = biosamples[0];
          return `${sample.cellFormat} ${sample.cellLabel} ${sample.tissueLabel}`.trim();
        }
        return "biosamples";
      },
      renderCell: ({ biosamples }) => {
        /* TODO: remove to handle only arrays */
        if (!biosamples) return "N/A";
        const entries = biosamples.map(({ cellFormat, cellLabel, tissueLabel, tissueId }) => ({
          name: cellFormat ? `${cellFormat}${cellLabel ? ` (${cellLabel})` : ""}` : tissueLabel,
          url:
            cellFormat || !tissueId
              ? null
              : `https://identifiers.org/${tissueId.replace("_", ":")}`,
          group: cellFormat ? "Assay" : "Organ system",
        }));

        return (
          <TableDrawer
            message={`${entries.length} biosystems`}
            caption="Biosystems"
            entries={entries}
          />
        );
      },
    },
    {
      id: "dosing",
      label: "Dosing effects",
      renderCell: ({ effects }) => {
        const circleUpData = effects
          ? effects.find(effect => effect.direction === "Activation/Increase/Upregulation")
          : null;
        const circleDownData = effects
          ? effects.find(effect => effect.direction === "Inhibition/Decrease/Downregulation")
          : null;
        return (
          <>
            {circleUpData ? (
              <Tooltip title={<EffectTooltipContent classes={classes} effect={circleUpData} />}>
                <span className={classes.circleUp}>
                  <FontAwesomeIcon className={classes.blue} icon={faArrowAltCircleUp} size="lg" />
                </span>
              </Tooltip>
            ) : (
              <FontAwesomeIcon
                className={`${classes.circleUp} ${classes.grey}`}
                icon={faArrowAltCircleUp}
                size="lg"
              />
            )}
            {circleDownData ? (
              <Tooltip title={<EffectTooltipContent classes={classes} effect={circleDownData} />}>
                <span>
                  <FontAwesomeIcon className={classes.blue} icon={faArrowAltCircleDown} size="lg" />
                </span>
              </Tooltip>
            ) : (
              <FontAwesomeIcon className={classes.grey} icon={faArrowAltCircleDown} size="lg" />
            )}
          </>
        );
      },
    },
    {
      id: "studies",
      label: "Experimental studies",
      renderCell: ({ studies }) => {
        /* TODO: remove to handle only arrays */
        if (!studies) return "N/A";
        return <SafetyStudiesDrawer studies={studies} />;
      },
    },
    {
      id: "datasource",
      label: "Source",
      renderCell: ({ datasource, literature, url }) =>
        literature ? (
          <PublicationsDrawer entries={[{ name: literature }]} customLabel={datasource} />
        ) : (
          <Link external to={url}>
            {datasource}
          </Link>
        ),
    },
  ];
}

function SafetyTable({ safetyLiabilities, query, variables }) {
  const classes = useStyles();
  return (
    <OtTable
      showGlobalFilter
      dataDownloader
      columns={getColumns(classes)}
      rows={safetyLiabilities}
      rowsPerPageOptions={defaultRowsPerPageOptions}
      query={query}
      variables={variables}
    />
  );
}

export default SafetyTable;
