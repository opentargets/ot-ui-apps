import _ from 'lodash';

const targetName = {
  id: 'symbol',
  label: 'Symbol',
  exportValue: data => data.target.approvedSymbol,
};

const diseaseName = {
  id: 'symbol',
  label: 'Symbol',
  exportValue: data => data.disease.name,
};

const asJSON = (columns, rows) => {
  const rowStrings = rows.map(row =>
    columns.reduce((accumulator, newKey) => {
      if (newKey.exportValue === false) return accumulator;

      const newLabel = _.camelCase(
        newKey.exportLabel || newKey.label || newKey.id
      );

      return {
        ...accumulator,
        [newLabel]: newKey.exportValue
          ? newKey.exportValue(row)
          : _.get(row, newKey.propertyPath || newKey.id, ''),
      };
    }, {})
  );

  return JSON.stringify(rowStrings);
};

const getHeaderString = ({ columns, quoteString, separator }) =>
  columns
    .reduce((headerString, column) => {
      if (column.exportValue === false) return headerString;

      const newLabel = quoteString(
        _.camelCase(column.exportLabel || column.label || column.id)
      );

      return [...headerString, newLabel];
    }, [])
    .join(separator);

const asDSV = (columns, rows, separator = ',', quoteStrings = true) => {
  const quoteString = d => {
    let result = d;
    // converts arrays to strings
    if (Array.isArray(d)) {
      result = d.join(',');
    }
    return quoteStrings && typeof result === 'string' ? `"${result}"` : result;
  };

  const lineSeparator = '\n';

  const headerString = getHeaderString({ columns, quoteString, separator });

  const rowStrings = rows
    .map(row =>
      columns
        .reduce((rowString, column) => {
          if (column.exportValue === false) return rowString;

          const newValue = quoteString(
            column.exportValue
              ? column.exportValue(row)
              : _.get(row, column.propertyPath || column.id, '')
          );

          return [...rowString, newValue];
        }, [])
        .join(separator)
    )
    .join(lineSeparator);

  return [headerString, rowStrings].join(lineSeparator);
};

export const getRowsQuerySelector = entityToGet =>
  entityToGet === 'target'
    ? 'data.disease.associatedTargets'
    : 'data.target.associatedDiseases';

export const getExportedColumns = (entityToGet, assocArr, prioArr) => {
  const nameColumn = entityToGet === 'target' ? targetName : diseaseName;
  let exportedColumns = [];
  const sources = assocArr.map(({ id }) => ({
    id,
    exportValue: data => {
      const datatypeScore = data.datasourceScores.find(
        datasourceScore => datasourceScore.componentId === id
      );
      return datatypeScore ? parseFloat(datatypeScore.score) : 'No data';
    },
  }));

  exportedColumns = [...sources];

  if (entityToGet === 'target') {
    const prioritisationExportCols = prioArr.map(({ id }) => ({
      id,
      exportValue: data => {
        const prioritisationScore = data.target.prioritisation.items.find(
          prioritisationItem => prioritisationItem.key === id
        );
        return prioritisationScore
          ? parseFloat(prioritisationScore.value)
          : 'No data';
      },
    }));

    exportedColumns = [...sources, ...prioritisationExportCols];
  }

  return [
    nameColumn,
    {
      id: 'score',
      label: 'Score',
      exportValue: data => data.score,
    },
    ...exportedColumns,
  ];
};

export const getExportedPrioritisationColumns = arr => {
  let exportedColumns = [];

  const prioritisationExportCols = arr.map(({ id }) => ({
    id,
    exportValue: data => {
      const prioritisationScore = data.target.prioritisation.items.find(
        prioritisationItem => prioritisationItem.key === id
      );
      return prioritisationScore
        ? parseFloat(prioritisationScore.value)
        : 'No data';
    },
  }));

  exportedColumns = [...prioritisationExportCols];

  return [
    targetName,
    {
      id: 'score',
      label: 'Score',
      exportValue: data => data.score,
    },
    ...exportedColumns,
  ];
};

export const createBlob = format =>
  ({
    json: (columns, rows) =>
      new Blob([asJSON(columns, rows)], {
        type: 'application/json;charset=utf-8',
      }),
    csv: (columns, rows) =>
      new Blob([asDSV(columns, rows)], {
        type: 'text/csv;charset=utf-8',
      }),
    tsv: (columns, rows) =>
      new Blob([asDSV(columns, rows, '\t', false)], {
        type: 'text/tab-separated-values;charset=utf-8',
      }),
  }[format]);

export const getFilteredColumnArray = (selectArray, requestArray) => {
  const arr = selectArray
    .map(ag => requestArray.filter(e => e.aggregation === ag))
    .flat(1);

  return arr.length > 0 ? arr : [];
};
