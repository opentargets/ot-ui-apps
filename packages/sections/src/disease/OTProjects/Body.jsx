import { Link, SectionItem, OtTable } from "ui";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { makeStyles } from "@mui/styles";
import { useQuery } from "@apollo/client";

import Description from "./Description";
import { defaultRowsPerPageOptions } from "../../constants";
import { definition } from ".";
import OT_PROJECTS_QUERY from "./OTProjectsQuery.gql";

const useStyles = makeStyles(theme => ({
  primaryColor: {
    color: theme.palette.primary.main,
  },
}));

const getColumns = classes => [
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
        <FontAwesomeIcon icon={faCheckCircle} className={classes.primaryColor} size="lg" />
      ) : null,
    exportValue: ({ integratesInPPP }) => (integratesInPPP ? "Yes" : "No"),
    filterValue: ({ integratesInPPP }) => (integratesInPPP ? "Yes" : "No"),
  },
];

function Body({ label, id: efoId, entity }) {
  const classes = useStyles();
  const request = useQuery(OT_PROJECTS_QUERY, {
    variables: { efoId },
  });

  return (
    <SectionItem
      definition={definition}
      request={request}
      entity={entity}
      renderDescription={() => <Description name={label} />}
      renderBody={({ disease }) => (
        <OtTable
          showGlobalFilter
          dataDownloader
          dataDownloaderFileStem={`${efoId}-otprojects`}
          columns={getColumns(classes)}
          rows={disease.otarProjects}
          rowsPerPageOptions={defaultRowsPerPageOptions}
          sortBy="status"
        />
      )}
    />
  );
}

export default Body;
