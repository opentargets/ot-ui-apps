import { usePlatformApi, Link, SectionItem } from "ui";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { makeStyles } from "@material-ui/core";
import Description from "./Description";
import { DataTable } from "../../components/Table";
import { defaultRowsPerPageOptions } from "../../constants";
import Summary from "./Summary";
import { definition } from ".";

const useStyles = makeStyles((theme) => ({
  primaryColor: {
    color: theme.palette.primary.main,
  },
}));

const getColumns = (classes) => [
  {
    id: "projectName",
    label: "Project name",
  },
  {
    id: "otarCode",
    label: "Project Code",
    renderCell: ({ otarCode }) => (
      <Link external to={`http://home.opentargets.org/${otarCode}`}>
        {otarCode}
      </Link>
    ),
  },
  {
    id: "integratesInPPP",
    label: "Integrates in PPP",
    renderCell: ({ integratesInPPP }) =>
      integratesInPPP ? (
        <FontAwesomeIcon
          icon={faCheckCircle}
          className={classes.primaryColor}
          size="lg"
        />
      ) : null,
    exportValue: ({ integratesInPPP }) => (integratesInPPP ? "yes" : "no"),
  },
];

function Body({ label, id: efoId, entity }) {
  const request = usePlatformApi(Summary.fragments.OTProjectsSummaryFragment);
  const classes = useStyles();

  return (
    <SectionItem
      definition={definition}
      request={request}
      entity={entity}
      renderDescription={() => <Description name={label} />}
      renderBody={({ otarProjects }) => (
        <DataTable
          showGlobalFilter
          dataDownloader
          dataDownloaderFileStem={`${efoId}-otprojects`}
          columns={getColumns(classes)}
          rows={otarProjects}
          rowsPerPageOptions={defaultRowsPerPageOptions}
          sortBy="status"
        />
      )}
    />
  );
}

export default Body;
