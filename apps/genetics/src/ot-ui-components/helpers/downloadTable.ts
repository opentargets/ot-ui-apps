import * as FileSaver from 'file-saver';

export type TableRow = { [key: string]: any };
export type HeaderMap = {
  id: string;
  label: string;
  export?: (o: Object) => any;
}[];
export type DownloadFormat = 'csv' | 'tsv' | 'json';

const UNEXPECTED_FORMAT =
  'Unexpected format. Supported options are csv, tsv and json.';

const pick = (object: TableRow, keys: HeaderMap) => {
  return keys.reduce(function (o, k) {
    // take into account optional export() function, which takes precedence as per other download formats
    o[k.id] = k.export ? k.export(object) : object[k.id];
    return o;
  }, {} as TableRow);
};

const quoteIfString = (d: any) => (typeof d === 'string' ? `"${d}"` : d);

const asJSONString = ({
  rows,
  headerMap,
}: {
  rows: TableRow[];
  headerMap: HeaderMap;
}) => {
  // use the full headerMap which contain optional export() function for each header
  const rowsHeadersOnly = rows.map(row => pick(row, headerMap));
  return JSON.stringify(rowsHeadersOnly);
};

const asCSVString = ({
  rows,
  headerMap,
}: {
  rows: TableRow[];
  headerMap: HeaderMap;
}) => {
  const separator = ',';
  const lineSeparator = '\n';
  const headersString = headerMap
    .map(d => quoteIfString(d.label))
    .join(separator);
  const rowsArray = rows.map(row => {
    return headerMap
      .map(header => {
        return quoteIfString(
          header.export ? header.export(row) : row[header.id]
        );
      })
      .join(separator);
  });
  return [headersString, ...rowsArray].join(lineSeparator);
};

const asTSVString = ({
  rows,
  headerMap,
}: {
  rows: TableRow[];
  headerMap: HeaderMap;
}) => {
  const separator = '\t';
  const lineSeparator = '\n';
  const headersString = headerMap.map(d => d.label).join(separator);
  const rowsArray = rows.map(row => {
    return headerMap
      .map(header => {
        return header.export ? header.export(row) : row[header.id];
      })
      .join(separator);
  });
  return [headersString, ...rowsArray].join(lineSeparator);
};

const asContentString = ({
  rows,
  headerMap,
  format,
}: {
  rows: TableRow[];
  headerMap: HeaderMap;
  format: DownloadFormat;
}) => {
  switch (format) {
    case 'json':
      return asJSONString({ rows, headerMap });
    case 'csv':
      return asCSVString({ rows, headerMap });
    case 'tsv':
      return asTSVString({ rows, headerMap });
    default:
      throw Error(UNEXPECTED_FORMAT);
  }
};

const asMimeType = (format: DownloadFormat) => {
  switch (format) {
    case 'json':
      return 'application/json;charset=utf-8';
    case 'csv':
      return 'text/csv;charset=utf-8';
    case 'tsv':
      return 'text/tab-separated-values;charset=utf-8';
    default:
      throw Error(UNEXPECTED_FORMAT);
  }
};

type DownloadTableArgs = {
  rows: TableRow[];
  headerMap: HeaderMap;
  format: DownloadFormat;
  filenameStem: string;
};
const downloadTable = ({
  rows,
  headerMap,
  format,
  filenameStem,
}: DownloadTableArgs) => {
  if (!rows || rows.length === 0) {
    console.info('Nothing to download.');
    return;
  }

  const contentString = asContentString({ rows, headerMap, format });
  const blob = new Blob([contentString], {
    type: asMimeType(format),
  });
  FileSaver.saveAs(blob, `${filenameStem}.${format}`, { autoBom: false });
};

export default downloadTable;
