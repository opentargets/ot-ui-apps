import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useSetRecoilState, useRecoilValue, useResetRecoilState, RecoilRoot } from "recoil";
import { SectionItem } from "ui";
import PublicationsList from "./PublicationsList";
import Description from "./Description";
import { literatureState, updateLiteratureState, fetchSimilarEntities } from "./atoms";
import Entities from "./Entities";
import Category from "./Category";
import CountInfo from "./CountInfo";
import { DateFilter } from "./DateFilter";

function LiteratureList({ id, name, entity, BODY_QUERY, definition }) {
  const [requestObj, setRequestObj] = useState({});

  const setLiteratureUpdate = useSetRecoilState(updateLiteratureState);
  const resetLiteratureState = useResetRecoilState(literatureState);

  const bibliographyState = useRecoilValue(literatureState);
  const { category, startYear, startMonth, endYear, endMonth } = bibliographyState;

  useEffect(
    () => {
      async function startRequest() {
        const inintRequest = await fetchSimilarEntities({
          id,
          query: BODY_QUERY,
          category,
          startYear,
          startMonth,
          endYear,
          endMonth,
        });
        setRequestObj(inintRequest);
        const data = inintRequest.data[entity];
        const update = {
          entities: data.similarEntities,
          litsIds: data.literatureOcurrences?.rows?.map(({ pmid }) => ({
            id: pmid,
            status: "ready",
            publication: null,
          })),
          litsCount: data.literatureOcurrences?.filteredCount,
          earliestPubYear: data.literatureOcurrences?.earliestPubYear,
          cursor: data.literatureOcurrences?.cursor,
          id,
          query: BODY_QUERY,
          globalEntity: entity,
        };
        setLiteratureUpdate(update);
      }
      startRequest();
      return function cleanUp() {
        resetLiteratureState();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return (
    <SectionItem
      definition={definition}
      request={requestObj}
      entity={entity}
      renderDescription={() => <Description name={name} />}
      renderBody={() => (
        <>
          <Box display="flex" sx={{ justifyContent: "space-between" }}>
            <Box display="flex" sx={{ flexDirection: "column" }}>
              <Category />
              <DateFilter />
            </Box>
            <CountInfo />
          </Box>
          <Entities id={id} name={name} />
          <PublicationsList hideSearch />
        </>
      )}
    />
  );
}

function Body({ definition, name, id, entity, BODY_QUERY }) {
  return (
    <RecoilRoot>
      <LiteratureList
        id={id}
        name={name}
        entity={entity}
        BODY_QUERY={BODY_QUERY}
        definition={definition}
      />
    </RecoilRoot>
  );
}

export default Body;
