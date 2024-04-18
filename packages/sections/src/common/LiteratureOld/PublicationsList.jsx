import { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState, useRecoilCallback } from "recoil";
import { Box, Grid, Fade, Skeleton } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { PublicationWrapper, Table } from "ui";
import Loader from "./Loader";

import {
  litsIdsState,
  loadingEntitiesState,
  displayedPublications,
  literaturesEuropePMCQuery,
  parsePublications,
  tablePageState,
  litsCountState,
  litsCursorState,
  literatureState,
  fetchSimilarEntities,
  updateLiteratureState,
  tablePageSizeState,
} from "./atoms";

const useStyles = makeStyles(() => ({
  root: {
    marginTop: 0,
  },
}));

function SkeletonRow() {
  return (
    <Fade in>
      <Box mb={2}>
        <Skeleton height={60} />
        {/* <Box pt="1px"> */}
        <Skeleton width="60%" height={45} />
        {/* </Box> */}
        <Grid container wrap="nowrap">
          <Box width={130} mr={1}>
            <Skeleton height={45} />
          </Box>
          <Box width={130}>
            <Skeleton height={45} />
          </Box>
        </Grid>
      </Box>
    </Fade>
  );
}

function PublicationsList({ hideSearch = false }) {
  const classes = useStyles();
  const lits = useRecoilValue(litsIdsState);
  const [loadingEntities, setLoadingEntities] = useRecoilState(loadingEntitiesState);
  const count = useRecoilValue(litsCountState);
  const cursor = useRecoilValue(litsCursorState);
  const displayedPubs = useRecoilValue(displayedPublications);
  const bibliographyState = useRecoilValue(literatureState);
  const setLiteratureUpdate = useSetRecoilState(updateLiteratureState);
  const page = useRecoilValue(tablePageState);
  const pageSize = useRecoilValue(tablePageSizeState);

  // function to request 'ready' literatures ids
  const syncLiteraturesState = useRecoilCallback(({ snapshot, set }) => async () => {
    const AllLits = await snapshot.getPromise(litsIdsState);
    const readyForRequest = AllLits.filter(x => x.status === "ready").map(x => x.id);

    if (readyForRequest.length === 0) return;
    const queryResult = await snapshot.getPromise(
      literaturesEuropePMCQuery({
        literaturesIds: readyForRequest,
      })
    );

    const parsedPublications = parsePublications(queryResult);

    const mapedResults = new Map(parsedPublications.map(key => [key.europePmcId, key]));

    const updatedPublications = AllLits.map(x => {
      const publication = mapedResults.get(x.id);
      if (x.status === "loaded") return x;
      const status = publication ? "loaded" : "missing";
      return { ...x, status, publication };
    });
    set(litsIdsState, updatedPublications);
  });

  useEffect(
    () => {
      if (lits.length !== 0) syncLiteraturesState();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lits]
  );

  const handleRowsPerPageChange = useRecoilCallback(({ snapshot }) => async newPageSize => {
    const pageSizeInt = Number(newPageSize);
    const expected = pageSizeInt * page + pageSizeInt;
    if (expected > lits.length && cursor !== null) {
      const {
        query,
        id,
        category,
        selectedEntities,
        cursor: newCursor,
        globalEntity,
        endYear,
        endMonth,
        startYear,
        startMonth,
      } = bibliographyState;
      setLoadingEntities(true);
      const request = await fetchSimilarEntities({
        query,
        id,
        category,
        entities: selectedEntities,
        cursor: newCursor,
        page: 0,
        endYear,
        endMonth,
        startYear,
        startMonth,
      });
      setLoadingEntities(false);
      const data = request.data[globalEntity];
      const loadedPublications = await snapshot.getPromise(litsIdsState);
      const newLits = data.literatureOcurrences?.rows?.map(({ pmid }) => ({
        id: pmid,
        status: "ready",
        publication: null,
      }));
      const update = {
        litsIds: [...loadedPublications, ...newLits],
        cursor: data.literatureOcurrences?.cursor,
        page: 0,
        pageSize: pageSizeInt,
      };
      setLiteratureUpdate(update);
    } else {
      setLiteratureUpdate({ page: 0, pageSize: pageSizeInt });
    }
  });

  const handlePageChange = useRecoilCallback(({ snapshot }) => async newPage => {
    const newPageInt = Number(newPage);
    if (pageSize * newPageInt + pageSize > lits.length && cursor !== null) {
      const {
        query,
        id,
        category,
        selectedEntities,
        cursor: newCursor,
        globalEntity,
        endYear,
        endMonth,
        startYear,
        startMonth,
      } = bibliographyState;
      setLoadingEntities(true);
      const request = await fetchSimilarEntities({
        query,
        id,
        category,
        entities: selectedEntities,
        cursor: newCursor,
        endYear,
        endMonth,
        startYear,
        startMonth,
      });
      setLoadingEntities(false);
      const data = request.data[globalEntity];
      const loadedPublications = await snapshot.getPromise(litsIdsState);
      const newLits = data.literatureOcurrences?.rows?.map(({ pmid }) => ({
        id: pmid,
        status: "ready",
        publication: null,
      }));
      const update = {
        litsIds: [...loadedPublications, ...newLits],
        cursor: data.literatureOcurrences?.cursor,
        page: newPageInt,
      };
      setLiteratureUpdate(update);
    } else {
      setLiteratureUpdate({ page: newPageInt });
    }
  });

  const columns = [
    {
      id: "publications",
      label: " ",
      renderCell: ({ publication, status }) => {
        if (status === "ready") return <SkeletonRow />;
        if (status === "missing") return null;
        return (
          <PublicationWrapper
            europePmcId={publication.europePmcId}
            title={publication.title}
            titleHtml={publication.titleHtml}
            authors={publication.authors}
            journal={publication.journal}
            variant={publication.variant}
            abstract={publication.abstract}
            fullTextOpen={publication.fullTextOpen}
            source={publication.source}
            patentDetails={publication.patentDetails}
          />
        );
      },
      filterValue: ({ row: publication }) =>
        `${publication.journal.journal?.title} ${publication?.title} ${publication?.year}
        ${publication.authors
          .reduce((acc, author) => {
            if (author.fullName) acc.push(author.fullName);
            return acc;
          }, [])
          .join(" ")}`,
    },
  ];

  if (loadingEntities)
    return <Loader pageSize={pageSize} message="Loading literature ocurrences results" />;

  return (
    <Table
      classes={classes}
      showGlobalFilter={!hideSearch}
      columns={columns}
      rows={displayedPubs}
      rowCount={count}
      rowsPerPageOptions={[5, 10, 25]}
      page={page}
      pageSize={pageSize}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handleRowsPerPageChange}
    />
  );
}

export default PublicationsList;
