import { useEffect } from 'react';
import { makeStyles, Box } from '@material-ui/core';
import {
  useSetRecoilState,
  useRecoilValue,
  useResetRecoilState,
  RecoilRoot,
} from 'recoil';
import PublicationsList from './PublicationsList';
import Description from './Description';
import SectionItem from '../../../components/Section/SectionItem';
import {
  literatureState,
  updateLiteratureState,
  fetchSimilarEntities,
} from './atoms';
import Entities from './Entities';
import Category from './Category';
import CountInfo from './CountInfo';

const useStyles = makeStyles(() => ({
  controlsContainer: {
    display: 'flex',
    alignItems: 'center',
    margin: '20px 0',
  },
}));

function LiteratureList({ id, name, entity, BODY_QUERY }) {
  const classes = useStyles();

  const setLiteratureUpdate = useSetRecoilState(updateLiteratureState);
  const resetLiteratureState = useResetRecoilState(literatureState);

  const bibliographyState = useRecoilValue(literatureState);
  const { category, startYear, startMonth, endYear, endMonth } =
    bibliographyState;

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
        const data = inintRequest.data[entity];
        const update = {
          entities: data.similarEntities,
          litsIds: data.literatureOcurrences?.rows?.map(({ pmid }) => ({
            id: pmid,
            status: 'ready',
            publication: null,
          })),
          litsCount: data.literatureOcurrences?.count,
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
    <div>
      <Box className={classes.controlsContainer}>
        <Category />
        <CountInfo />
      </Box>
      <Entities id={id} name={name} />
      <PublicationsList hideSearch handleRowsPerPageChange={() => ({})} />
    </div>
  );
}

function Body({ definition, name, id, entity, BODY_QUERY }) {
  return (
    <RecoilRoot>
      <SectionItem
        definition={definition}
        request={{ loading: false, error: null, data: true }}
        renderDescription={() => <Description name={name} />}
        renderBody={() => (
          <LiteratureList
            id={id}
            name={name}
            entity={entity}
            BODY_QUERY={BODY_QUERY}
          />
        )}
      />
    </RecoilRoot>
  );
}

export default Body;
