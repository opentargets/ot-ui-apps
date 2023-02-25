import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { formatSearchData } from "../utils/searchUtils";

function useSearchQueryData(SEARCH_QUERY) {
  const [data, setData] = useState<
    {
      [key: string]: unknown;
      type: string;
      entity: unknown;
    }[]
  >([]);

  const [getData, { loading, data: searchResult }] = useLazyQuery(SEARCH_QUERY);

  const getSearchData = (value) => {
    getData({ variables: { queryString: value } });
  };

  useEffect(() => {
    if (searchResult) {
      searchResult.search
        ? setData(formatSearchData(searchResult.search))
        : setData(formatSearchData(searchResult));
    }
  }, [searchResult]);

  return [getSearchData, { data, loading }] as const;
}

export default useSearchQueryData;
