import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { formatSearchData } from "../utils/searchUtils";

function useSearchQueryData(SEARCH_QUERY) {
  const [data, setData] = useState([]);

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

  return [getSearchData, { data, loading }];
}

export default useSearchQueryData;
