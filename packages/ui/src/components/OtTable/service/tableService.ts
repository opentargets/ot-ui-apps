import client from "../../../client";

export async function getTableRows(query, variables, cursor, size, freeTextQuery): Promise<[]> {
  const resData = await client.query({
    query,
    variables: {
      ...variables,
      cursor,
      size,
      freeTextQuery,
    },
    fetchPolicy: "no-cache",
  });
  // check and return only rows/count/cursor
  return resData;
}
