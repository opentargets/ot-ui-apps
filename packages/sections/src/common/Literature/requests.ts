import client from "../../client";
import { europePmcBiblioSearchPOSTQuery } from "../../utils/urls";
import { SelectedEntityType } from "./types";

export async function literaturesEuropePMCQuery({ literaturesIds }) {
  if (literaturesIds.length === 0) return [];
  const { baseUrl, requestOptions } = europePmcBiblioSearchPOSTQuery(literaturesIds);
  const response = await fetch(baseUrl, requestOptions).then(response => response.json());
  if (response.error) throw response.error;
  return response.resultList?.result;
}

type fetchSimilarEntitiesParam = {
  id?: string;
  threshold?: number;
  size?: number;
  query: any;
  cursor?: any;
  category: string[];
  entities: SelectedEntityType[];
  startYear?: number | null;
  startMonth?: number | null;
  endYear?: number | null;
  endMonth?: number | null;
};

export const fetchSimilarEntities = ({
  id = "",
  threshold = 0.5,
  size = 15,
  query,
  cursor = null,
  category = [],
  entities = [],
  startYear = null,
  startMonth = null,
  endYear = null,
  endMonth = null,
}: fetchSimilarEntitiesParam) => {
  const entityNames = category.length === 0 ? null : category;
  const ids = entities.map(c => c.object.id);
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
