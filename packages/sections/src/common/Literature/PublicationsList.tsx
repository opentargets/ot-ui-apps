import { useEffect } from "react";
import { Box, Grid, Fade, Skeleton } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { PublicationWrapper, Table, useApolloClient } from "ui";
import Loader from "./Loader";
import { PublicationType, DetailsStateType } from "./types";
import {
  useDisplayedPublications,
  useLiterature,
  useLiteratureDispatch,
  useDetails,
  useDetailsDispatch,
} from "./LiteratureContext";
import { fetchSimilarEntities, literaturesEuropePMCQuery } from "./requests";

const useStyles = makeStyles(() => ({
  root: {
    marginTop: 0,
  },
}));

function parsePublications(publications: PublicationType[]): DetailsStateType {
  const obj: DetailsStateType = {};
  for (const pub of publications) {
    obj[pub.id] = {
      source: pub.source,
      patentDetails: pub.patentDetails,
      europePmcId: pub.id,
      fullTextOpen: !!(pub.inEPMC === "Y" || pub.inPMC === "Y"),
      title: pub.title,
      year: pub.pubYear,
      abstract: pub.abstractText,
      openAccess: pub.isOpenAccess !== "N",
      authors: pub.authorList?.author || [],
      journal: {
        ...pub.journalInfo,
        page: pub.pageInfo,
      },
    };
  }
  return obj;
}

function SkeletonRow() {
  return (
    <Fade in>
      <Box mb={2}>
        <Skeleton height={60} />
        <Skeleton width="60%" height={45} />
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
  const literature = useLiterature();
  const { loadingEntities, litsCount: count, cursor, page, pageSize, litsIds } = literature;
  const details = useDetails();
  const displayedPubs = useDisplayedPublications();
  const literatureDispatch = useLiteratureDispatch();
  const detailsDispatch = useDetailsDispatch();
  const client = useApolloClient();

  // get publications details from Europe PMC
  useEffect(() => {
    const fetchFunction = async () => {
      const missingDetails = litsIds.filter((id: string) => !details[id]);
      if (missingDetails.length === 0) return;
      detailsDispatch({
        type: "setToLoading",
        value: missingDetails,
      });
      const queryResult = await literaturesEuropePMCQuery({
        literaturesIds: missingDetails,
      });
      detailsDispatch({
        type: "addDetails",
        value: parsePublications(queryResult),
      });
    };
    fetchFunction().catch(console.error);
  }, [literature]);

  const handleRowsPerPageChange = async (newPageSize: string): Promise<void> => {
    const pageSizeInt = Number(newPageSize);
    const expected = pageSizeInt * page + pageSizeInt;
    if (expected > litsIds.length && cursor !== null) {
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
      } = literature;
      literatureDispatch({ type: "loadingEntities", value: true });
      const request = await fetchSimilarEntities({
        client,
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
      literatureDispatch({ type: "loadingEntities", value: false });
      const data = request.data[globalEntity];
      const newLitsIds = data.literatureOcurrences?.rows?.map(({ pmid }) => pmid) ?? [];
      const update = {
        litsIds: [...litsIds, ...newLitsIds],
        cursor: data.literatureOcurrences?.cursor,
        page: 0,
        pageSize: pageSizeInt,
      };
      literatureDispatch({ type: "stateUpdate", value: update });
    } else {
      literatureDispatch({
        type: "stateUpdate",
        value: { page: 0, pageSize: pageSizeInt },
      });
    }
  };

  const handlePageChange = async (newPage: string): Promise<void> => {
    const newPageInt = Number(newPage);
    if (pageSize * newPageInt + pageSize > litsIds.length && cursor !== null) {
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
      } = literature;
      literatureDispatch({ type: "loadingEntities", value: true });
      const request = await fetchSimilarEntities({
        client,
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
      literatureDispatch({ type: "loadingEntities", value: false });
      const data = request.data[globalEntity];
      const newLitsIds = data.literatureOcurrences?.rows?.map(({ pmid }) => pmid) ?? [];
      const update = {
        litsIds: [...litsIds, ...newLitsIds],
        cursor: data.literatureOcurrences?.cursor,
        page: newPageInt,
      };
      literatureDispatch({ type: "stateUpdate", value: update });
    } else {
      literatureDispatch({
        type: "stateUpdate",
        value: { page: newPageInt },
      });
    }
  };

  const columns = [
    {
      id: "publications",
      label: " ",
      renderCell(id) {
        const det = details[id];
        if (det === "loading") {
          return <SkeletonRow />;
        } else if (!det) {
          return null;
        } else {
          return (
            <PublicationWrapper
              europePmcId={det.europePmcId}
              title={det.title}
              titleHtml={det.titleHtml}
              authors={det.authors}
              journal={det.journal}
              variant={det.variant}
              abstract={det.abstract}
              fullTextOpen={det.fullTextOpen}
              source={det.source}
              patentDetails={det.patentDetails}
            />
          );
        }
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
