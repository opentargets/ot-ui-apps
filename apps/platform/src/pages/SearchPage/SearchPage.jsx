import { useState, useEffect, lazy, Suspense } from "react";
import queryString from "query-string";
import { Typography } from "@mui/material";
import { useLocation, useHistory } from "react-router-dom";
import { LoadingBackdrop, EmptyPage, BasePage } from "ui";

import client from "../../client";
import SEARCH_PAGE_QUERY from "./SearchPageQuery.gql";
import config from "../../config";

const SearchContainer = lazy(() => import("./SearchContainer"));

const QS_OPTIONS = {
  sort: false,
  arrayFormat: "comma",
  skipNull: true,
};

const parseQueryString = qs => {
  const params = queryString.parse(qs, QS_OPTIONS);
  if (!params.entities) {
    params.entities = [];
  } else if (typeof params.entities === "string") {
    params.entities = [params.entities];
  }
  return params;
};

function SearchPage() {
  const location = useLocation();
  const history = useHistory();
  const { q, page, entities } = parseQueryString(location.search);
  const [data, setData] = useState(null);

  useEffect(() => {
    let isCurrent = true;
    client
      .query({
        query: SEARCH_PAGE_QUERY,
        variables: {
          queryString: q,
          index: page - 1,
          entityNames: entities,
        },
      })
      .then(res => {
        if (isCurrent) {
          setData(res.data);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [q, page, entities]);

  const handleChangePage = (event, pageChanged) => {
    const params = { q, page: pageChanged + 1, entities };
    const qs = queryString.stringify(params, QS_OPTIONS);
    history.push(`/search?${qs}`);
  };

  const handleSetEntity = entity => (event, checked) => {
    const params = {
      q,
      page: 1, // reset to page 1
      entities: checked ? [...entities, entity] : entities.filter(e => e !== entity),
    };
    const qs = queryString.stringify(params, QS_OPTIONS);
    history.push(`/search?${qs}`);
  };

  let SEARCH_CONTAINER = null;

  if (data && data.search.total === 0) {
    SEARCH_CONTAINER = (
      <EmptyPage
        communityLink={config.profile.communityUrl}
        documentationLink={config.profile.documentationUrl}
      >
        <Typography>
          We could not find anything in the Platform database that matches &quot;{q}&quot;
        </Typography>
      </EmptyPage>
    );
  } else if (data) {
    SEARCH_CONTAINER = (
      <SearchContainer
        q={q}
        page={page}
        entities={entities}
        onSetEntity={handleSetEntity}
        onPageChange={handleChangePage}
        data={data}
      />
    );
  } else {
    SEARCH_CONTAINER = null;
  }

  return (
    <BasePage>
      <Suspense fallback={<LoadingBackdrop />}>{SEARCH_CONTAINER}</Suspense>
    </BasePage>
  );
}

export default SearchPage;
