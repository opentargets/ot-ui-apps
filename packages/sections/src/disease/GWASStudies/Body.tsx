import { useQuery } from "@apollo/client";
import type { SortingState } from "@tanstack/react-table";
import { ReactElement } from "react";
import {
  Link,
  SectionItem,
  Tooltip,
  PublicationsDrawer,
  OtTableServer,
  Box,
  Typography,
} from "ui";
import { naLabel } from "@ot/constants";
import { epmcUrl, getStudyCategory } from "@ot/utils";
import Description from "./Description";

import GWAS_STUDIES_BODY_QUERY from "./GWASStudiesQuery.gql";
import { definition } from ".";

const columns = [
  {
    id: "id",
    label: "Study",
    enableHiding: false,
    renderCell: ({ id }: { id: string }) => (
      <Link asyncTooltip to={`/study/${id}`}>
        {id}
      </Link>
    ),
  },
  {
    id: "traitFromSource",
    label: "Reported trait",
    sortable: true,
  },
  {
    id: "nSamples",
    label: "Sample size",
    renderCell: ({ nSamples }: { nSamples: number }) => {
      return typeof nSamples === "number" ? nSamples.toLocaleString() : naLabel;
    },
    sortable: true,
  },
  {
    id: "cohorts",
    label: "Cohorts",
    renderCell: ({ projectId, cohorts, ldPopulationStructure }: { projectId: string; cohorts: string[]; ldPopulationStructure: { ldPopulation: string; relativeSampleSize: number }[] }) => {
      let displayText;
      if (getStudyCategory(projectId) === "FINNGEN") displayText = "FinnGen";
      else if (cohorts?.length) displayText = cohorts.join(", ");
      else return naLabel;
      return ldPopulationStructure?.length ? (
        <Tooltip
          title={
            <>
              <Typography variant="subtitle2" display="block" align="center">
                LD populations and relative sample sizes
              </Typography>
              {ldPopulationStructure.map(({ ldPopulation, relativeSampleSize }) => (
                <Box key={ldPopulation}>
                  <Typography variant="caption">
                    {ldPopulation}: {relativeSampleSize}
                  </Typography>
                </Box>
              ))}
            </>
          }
          showHelpIcon
        >
          {displayText}
        </Tooltip>
      ) : (
        displayText
      );
    },
    exportValue: ({ projectId, cohorts }: { projectId: string; cohorts: string[] }) =>
      getStudyCategory(projectId) === "FINNGEN"
        ? "FinnGen"
        : cohorts?.length
        ? cohorts.join(", ")
        : null,
  },
  {
    id: "publication",
    label: "Publication",
    sortable: true,
    renderCell: ({ publicationFirstAuthor, publicationDate, pubmedId, projectId }: { publicationFirstAuthor: string; publicationDate: string; pubmedId: string; projectId: string } ) => {
      if (!publicationFirstAuthor) return naLabel;
      return (
        <PublicationsDrawer
          entries={[{ name: pubmedId, url: epmcUrl(pubmedId) }]}
          customLabel={`${
            getStudyCategory(projectId) === "FINNGEN"
              ? "FinnGen"
              : publicationFirstAuthor || naLabel
          } et al. (${new Date(publicationDate).getFullYear()})`}
        />
      );
    },
    filterValue: ({ publicationYear, publicationFirstAuthor }: { publicationYear: string; publicationFirstAuthor: string }) =>
      `${publicationYear} ${publicationFirstAuthor}`,
    exportValue: ({ pubmedId }: { pubmedId: string }) => `${pubmedId}`,
  },
  {
    id: "credibleSets",
    label: "Credible sets count",
    renderCell: ({ credibleSets }: { credibleSets: { count: number } }) => {
      return credibleSets?.count ?? naLabel;
    },
  },
];

// column id -> StudySortField of the API; columns not listed here are not sortable
const SORT_FIELDS: Record<string, string> = {
  traitFromSource: "TRAIT_FROM_SOURCE",
  nSamples: "N_SAMPLES",
  publication: "PUBLICATION_AUTHOR_DATE",
};

const DEFAULT_SORTING: SortingState = [{ id: "nSamples", desc: true }];

export function getStudySortVariables(sorting: SortingState) {
  const sort = sorting
    .filter(({ id }) => SORT_FIELDS[id])
    .map(({ id, desc }) => ({ key: SORT_FIELDS[id], direction: desc ? "DESCENDING" : "ASCENDING" }));
  return { sort };
}

const PAGE_SIZE = 10;

type BodyProps = {
  id: string;
  label: string;
};

function Body({ id: efoId, label: diseaseName }: BodyProps): ReactElement {
  const variables = { diseaseIds: [efoId] };

  // first page only: drives the section loading/error state, the table fetches
  // the same page from the Apollo cache and then paginates on its own
  const request = useQuery(GWAS_STUDIES_BODY_QUERY, {
    variables: { ...variables, index: 0, size: PAGE_SIZE, ...getStudySortVariables(DEFAULT_SORTING) },
  });

  return (
    <SectionItem
      definition={definition}
      entity="studies"
      showContentLoading
      loadingMessage="Loading data. This may take some time..."
      request={request}
      renderDescription={() => <Description name={diseaseName} />}
      renderBody={() => (
        <OtTableServer
          columns={columns}
          query={GWAS_STUDIES_BODY_QUERY}
          variables={variables}
          dataPath="studies"
          pageSize={PAGE_SIZE}
          sortBy={DEFAULT_SORTING[0].id}
          order="desc"
          getSortVariables={getStudySortVariables}
          searchVariable="search"
          globalFilterPlaceholderText="Search studies..."
          dataDownloader
          dataDownloaderFileStem={`${efoId}-gwas-studies`}
        />
      )}
    />
  );
}

export default Body;
