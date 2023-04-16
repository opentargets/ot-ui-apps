import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { makeStyles } from '@mui/styles';
import Description from './Description';
import Link from '../../../components/Link';
import { DataTable } from '../../../components/Table';
import SectionItem from '../../../components/Section/SectionItem';
import { defaultRowsPerPageOptions } from '../../../constants';
import Summary from './Summary';
import usePlatformApi from '../../../hooks/usePlatformApi';

const useStyles = makeStyles(theme => {
  return {
    primaryColor: {
      color: theme.palette.primary.main,
    },
  };
});

const getColumns = classes => [
  {
    id: 'projectName',
    label: 'Project name',
  },
  {
    id: 'otarCode',
    label: 'Project Code',
    renderCell: ({ otarCode }) => {
      return (
        <Link external to={`http://home.opentargets.org/${otarCode}`}>
          {otarCode}
        </Link>
      );
    },
  },
  {
    id: 'integratesInPPP',
    label: 'Integrates in PPP',
    renderCell: ({ integratesInPPP }) =>
      integratesInPPP ? (
        <FontAwesomeIcon
          icon={faCheckCircle}
          className={classes.primaryColor}
          size="lg"
        />
      ) : null,
    exportValue: ({ integratesInPPP }) => (integratesInPPP ? 'yes' : 'no'),
  },
];

function Body({ definition, label, id: efoId }) {
  const request = usePlatformApi(Summary.fragments.OTProjectsSummaryFragment);
  const classes = useStyles();

  return (
    <SectionItem
      definition={definition}
      request={request}
      renderDescription={() => <Description name={label} />}
      renderBody={({ otarProjects }) => {
        return (
          <DataTable
            showGlobalFilter
            dataDownloader
            dataDownloaderFileStem={`${efoId}-otprojects`}
            columns={getColumns(classes)}
            rows={otarProjects}
            rowsPerPageOptions={defaultRowsPerPageOptions}
            sortBy="status"
          />
        );
      }}
    />
  );
}

export default Body;
