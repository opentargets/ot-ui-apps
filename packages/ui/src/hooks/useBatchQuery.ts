import _ from "lodash";

import defaultClient from "../client";
import { tableChunkSize } from "../constants";
import { DocumentNode } from "@apollo/client";

type useBatchQueryProps = {
  query: DocumentNode;
  variables: Record<string, unknown>;
  dataPath: string;
  size?: number;
  client?: any;
  rowField?: string;
  countField?: string;
};
/**
 * Provides a function to asynchronously batch-download a whole dataset from
 * the backend.
 *
 * The function uses the parameter downloaderChunkSize from the configuration.js
 * file to determine the size of the chunks to fetch.
 *
 * @param {import('graphql').DocumentNode} query Query to run to fetch the data.
 * @param {import('apollo-client').QueryOptions} variables Variables object for the query.
 * @param {string} dataPath Path where the data array, row count and cursor are inside the query's result.
 * @param {string} [rowField=rows] field in dataPath containing the rows. Default: 'rows'.
 * @param {string} [countField=count] field in dataPath containing the row count. Default: 'count'.
 *
 * @returns {Function} Function that will fetch the whole dataset.
 */
function useBatchQuery({
  query,
  variables,
  dataPath,
  client = defaultClient,
  size = tableChunkSize,
  rowField = "rows",
  countField = "count",
}: useBatchQueryProps): () => Promise<Record<string, unknown>[]> {
  const rowPath = `${dataPath}.${rowField}`;
  const countPath = `${dataPath}.${countField}`;

  const getDataChunk = async (index: number) =>
    client.query({
      query,
      variables: { ...variables, index, size },
    });

  return async function getWholeDataset() {
    const chunkPromises = [];
    let data: Array<Record<string, unknown>> = [];
    let index = 0;

    const firstChunk = await getDataChunk(index);

    data = [...getRows(firstChunk, rowPath)];
    index += 1;

    const count = Math.ceil(_.get(firstChunk, countPath) / size);

    while (index < count) {
      chunkPromises.push(getDataChunk(index));
      index += 1;
    }

    const remainingChunks = await Promise.all(chunkPromises);

    remainingChunks.forEach(chunk => {
      data = [...data, ...getRows(chunk, rowPath)];
    });

    const wholeData = setRows(firstChunk, rowPath, data);

    return wholeData;
  };
}

function getRows(data: Record<string, unknown>, dataPath: string) {
  return _.get(data, dataPath, []);
}

function setRows(
  res: Promise<Record<string, unknown>>,
  dataPath: string,
  rows: Record<string, unknown>[]
): Promise<Record<string, unknown>> | null {
  if (!res || !rows) return null;
  const wholeRes = structuredClone(res);
  const obj = _.get(wholeRes, dataPath);
  Object.assign(obj, rows);
  return wholeRes;
}

export default useBatchQuery;
