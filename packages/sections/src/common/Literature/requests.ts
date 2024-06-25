import client from "../../client";
import { europePmcBiblioSearchPOSTQuery } from "../../utils/urls";

export async function literaturesEuropePMCQuery({ literaturesIds }) {
  if (literaturesIds.length === 0) return [];
  const { baseUrl, requestOptions } =
    europePmcBiblioSearchPOSTQuery(literaturesIds);
  const response =
    await fetch(baseUrl, requestOptions).then(response => response.json());
  if (response.error) throw response.error;
  return response.resultList?.result;
};

export const fetchSimilarEntities = ({
  id = "",
  threshold = 0.5,
  size = 6,
  query,
  cursor = null,
  category = [],
  entities = [],
  startYear = null,
  startMonth = null,
  endYear = null,
  endMonth = null,
// DO NOT GIVE PARAM A TYPE FOR NOW SINCE TS COMPLAINS IF ANY MISSING PROPS - THE
// TYPE DEFN SAYS THEY CAN BE NULL BUT THIS IS NOT THE SAME AS MISSING (UNDEFINED)
// }: LiteratureStateType) => {
}) => {
  const entityNames = category.length === 0 ? null : category;
  // USE SQUARE BRACKETS TO STOP TYPESCRIPT COMPLAINING:
  //   https://stackoverflow.com/questions/44147937/property-does-not-exist-on-type-never
  // const ids = entities.map(c => c.object.id);
  const ids = entities.map(c => c['object']['id']);
  return client.query({
    query,
    variables: {
      cursor,
      id,
      ids,
      startYear,
      startMonth,
      endYear,
      endMonth,
      threshold,
      size,
      entityNames,
    },
  });
};