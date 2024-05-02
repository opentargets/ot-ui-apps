import { useEffect, useState } from "react";
import { Box, Grid, Fade, Skeleton } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { PublicationWrapper, Table } from "ui";
import Loader from "./Loader";
import type { PublicationType, RowType } from "./types";
import {
  useDisplayedPublications, useLiterature, useLiteratureDispatch,
} from "./LiteratureContext";
import { fetchSimilarEntities, literaturesEuropePMCQuery } from "./requests";

const useStyles = makeStyles(() => ({
  root: {
    marginTop: 0,
  },
}));

function parsePublications(publications: PublicationType[]) {
  return publications.map(pub => {
    const row: RowType = {
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
    return row;
  });
}

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

  const [publicationDetails, setPublicationDetails] = useState(new Map);
  const classes = useStyles();
  const literature = useLiterature();
  const {
    loadingEntities,
    litsCount: count,
    cursor,
    page,
    pageSize,
    litsIds: lits,
  } = literature;
  const displayedPubs = useDisplayedPublications();
  const literatureDispatch = useLiteratureDispatch();

  // get publications details from Europe PMC 
  useEffect(() => {
    const fetchFunction = async() => {
      const missingDetails =
        lits.filter(lit => !publicationDetails.has(lit.id));
      if (missingDetails.length === 0) return;
      const queryResult = await literaturesEuropePMCQuery({
        literaturesIds: missingDetails.map(x => x.id)
      });
      setPublicationDetails(currentMap => {
        const newMap = new Map(currentMap);
        for (const p of parsePublications(queryResult)) {
          newMap.set(p.europePmcId, p);
        };
        return newMap;
      });
    };
    fetchFunction().catch(console.error);
  }, [literature]);

  const handleRowsPerPageChange = async newPageSize => {
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
      } = literature;
      literatureDispatch({ type: 'loadingEntities', value: true });
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
      literatureDispatch({ type: 'loadingEntities', value: false });
      const data = request.data[globalEntity];
      const newLits = data.literatureOcurrences?.rows?.map(({ pmid }) => ({
        id: pmid,
        status: "ready",
        publication: null,
      }));
      const update = {
        litsIds: [...lits, ...newLits],
        cursor: data.literatureOcurrences?.cursor,
        page: 0,
        pageSize: pageSizeInt,
      };
      literatureDispatch({ type: 'stateUpdate', value: update });
    } else {
      literatureDispatch({ 
        type: 'stateUpdate',
        value: { page: 0, pageSize: pageSizeInt }
      });
    }
  };

  const handlePageChange = async newPage => {
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
      } = literature;
      literatureDispatch({ type: 'loadingEntities', value: true });
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
      literatureDispatch({ type: 'loadingEntities', value: false });
      const data = request.data[globalEntity];
      const newLits = data.literatureOcurrences?.rows?.map(({ pmid }) => ({
        id: pmid,
        status: "ready",
        publication: null,
      }));
      const update = {
        litsIds: [...lits, ...newLits],
        cursor: data.literatureOcurrences?.cursor,
        page: newPageInt,
      };
      literatureDispatch({ type: 'stateUpdate', value: update });
    } else {
      literatureDispatch({
        type: 'stateUpdate',
        value: ({ page: newPageInt })
      });
    }
  };

  const columns = [
    {
      id: "publications",
      label: " ",
      renderCell({ id }) {
        if (!publicationDetails?.has(id)) return <SkeletonRow />;
        const publication = publicationDetails.get(id);
        if (!publication) return null;
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
      onPageChange={handlePageChange as any}                // !! HACK TO STOP TS COMPLAINING
      onRowsPerPageChange={handleRowsPerPageChange as any}  // !! HACK TO STOP TS COMPLAINING
    />
  );
}

export default PublicationsList;