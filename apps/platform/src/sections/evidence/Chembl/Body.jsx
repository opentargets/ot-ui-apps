import { useQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/core';
import { DataTable, TableDrawer } from '../../../components/Table';
import {
  defaultRowsPerPageOptions,
  phaseMap,
  sourceMap,
  naLabel,
} from '../../../constants';
import { dataTypesMap } from '../../../dataTypes';
import Description from './Description';
import Link from '../../../components/Link';
import SectionItem from '../../../components/Section/SectionItem';
import Summary from './Summary';
import Tooltip from '../../../components/Tooltip';
import usePlatformApi from '../../../hooks/usePlatformApi';
import ChipList from '../../../components/ChipList';

import CHEMBL_QUERY from './ChemblQuery.gql';

const useStyles = makeStyles(() => ({
  tooltipContainer: {
    padding: '0.3em',
  },
  chipContainer: {
    display: 'inline-block',
    marginTop: '0.4em',
  },
  chipStyle: {
    fontSize: '0.625rem',
  },
}));

function getColumns(classes) {
  return [
    {
      id: 'disease.name',
      label: 'Disease/phenotype',
      renderCell: ({ disease }) => (
        <Link to={`/disease/${disease.id}`}>{disease.name}</Link>
      ),
    },
    {
      label: 'Targets',
      renderCell: ({ target, drug, targetFromSourceId }) => {
        const mechanismsOfAction = drug.mechanismsOfAction || {};
        const { rows = [] } = mechanismsOfAction;

        let symbol = '';

        const otherTargets = rows.reduce((acc, { targets }) => {
          targets.forEach(({ id, approvedSymbol }) => {
            if (id !== target.id) {
              acc.add(id);
            } else {
              symbol = approvedSymbol;
            }
          });
          return acc;
        }, new Set());

        if (symbol === '') {
          const { approvedSymbol: targetSymbol } = target;
          symbol = targetSymbol;
        }

        return (
          <>
            <Tooltip
              title={
                <>
                  Reported target:{' '}
                  <Link
                    external
                    to={`https://identifiers.org/uniprot/${targetFromSourceId}`}
                  >
                    {targetFromSourceId}
                  </Link>
                </>
              }
              showHelpIcon
            >
              <Link to={`/target/${target.id}`}>{symbol}</Link>
            </Tooltip>
            {otherTargets.size > 0
              ? ` and ${otherTargets.size} other target${
                  otherTargets.size > 1 ? 's' : ''
                }`
              : null}
          </>
        );
      },
    },
    {
      id: 'drug.name',
      label: 'Drug',
      renderCell: ({ drug }) => (
        <Link to={`/drug/${drug.id}`}>{drug.name}</Link>
      ),
    },
    {
      id: 'drug.drugType',
      label: 'Modality',
    },
    {
      label: 'Mechanism of action (MoA)',
      renderCell: ({ target, drug }) => {
        const mechanismsOfAction = drug.mechanismsOfAction || {};
        const { rows = [] } = mechanismsOfAction;

        let anchorMa = null;

        const mas = rows.reduce((acc, { mechanismOfAction, targets }) => {
          if (anchorMa === null) {
            let isAssociated = false;
            for (let i = 0; i < targets.length; i++) {
              if (targets[i].id === target.id) {
                anchorMa = mechanismOfAction;
                isAssociated = true;
                break;
              }
            }

            if (!isAssociated) {
              acc.add(mechanismOfAction);
            }
          } else {
            acc.add(mechanismOfAction);
          }

          return acc;
        }, new Set());

        return `${anchorMa || naLabel}${
          mas.size > 0 ? ` and ${mas.size} other MoA` : ''
        }`;
      },
    },
    {
      id: 'clinicalPhase',
      label: 'Phase',
      sortable: true,
      renderCell: ({ clinicalPhase }) => phaseMap(clinicalPhase),
      filterValue: ({ clinicalPhase }) => phaseMap(clinicalPhase),
    },
    {
      id: 'clinicalStatus',
      label: 'Status',
      renderCell: ({
        studyStopReason,
        clinicalStatus,
        studyStopReasonCategories,
      }) => {
        if (clinicalStatus && studyStopReason)
          return (
            <Tooltip
              showHelpIcon
              title={
                <div className={classes.tooltipContainer}>
                  <div>
                    <span>Study stop reason: {studyStopReason}</span>
                  </div>
                  <div className={classes.chipContainer}>
                    {studyStopReasonCategories ? (
                      <ChipList
                        items={studyStopReasonCategories.map(reason => ({
                          label: reason,
                          customClass: classes.chipStyle,
                        }))}
                      />
                    ) : null}
                  </div>
                </div>
              }
            >
              {clinicalStatus}
            </Tooltip>
          );
        if (clinicalStatus) return clinicalStatus;
        return naLabel;
      },
    },
    {
      id: 'studyStartDate',
      label: 'Start Date',
      numeric: true,
      renderCell: ({ studyStartDate }) =>
        studyStartDate ? new Date(studyStartDate).getFullYear() : naLabel,
    },
    {
      label: 'Source',
      renderCell: ({ urls }) => {
        const urlList = urls.map(({ niceName, url }) => ({
          name: sourceMap[niceName] ? sourceMap[niceName] : niceName,
          url,
          group: 'sources',
        }));
        return <TableDrawer entries={urlList} caption="Sources" />;
      },
      filterValue: ({ urls }) => {
        const labels = urls.map(({ niceName }) =>
          sourceMap[niceName] ? sourceMap[niceName] : niceName
        );
        return labels.join();
      },
    },
  ];
}

export function BodyCore({ definition, id, label, count }) {
  const { ensgId, efoId } = id;

  const variables = {
    ensemblId: ensgId,
    efoId,
    size: count,
  };

  const request = useQuery(CHEMBL_QUERY, {
    variables,
  });

  const classes = useStyles();
  const columns = getColumns(classes);

  return (
    <SectionItem
      definition={definition}
      chipText={dataTypesMap.known_drug}
      request={request}
      renderDescription={() => (
        <Description symbol={label.symbol} name={label.name} />
      )}
      renderBody={({ disease }) => {
        const { rows } = disease.evidences;
        return (
          <DataTable
            columns={columns}
            rows={rows}
            rowsPerPageOptions={defaultRowsPerPageOptions}
            sortBy="clinicalPhase"
            order="desc"
            dataDownloader
            showGlobalFilter
            query={CHEMBL_QUERY.loc.source.body}
            variables={variables}
          />
        );
      }}
    />
  );
}

export function Body({ definition, id, label }) {
  const { data: summaryData } = usePlatformApi(
    Summary.fragments.ChemblSummaryFragment
  );
  const { count } = summaryData.chemblSummary;

  if (!count || count < 1) {
    return null;
  }

  return (
    <BodyCore definition={definition} id={id} label={label} count={count} />
  );
}
