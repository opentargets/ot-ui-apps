import { useQuery } from "@apollo/client";
import { Box, Typography } from "@mui/material";
import { Link, SectionItem, DataTable, Tooltip } from "ui";
import { definition } from ".";
import Description from "./Description";
import { defaultRowsPerPageOptions, naLabel } from "../../constants";
import RELATED_GWAS_STUDIES_QUERY from "./RelatedGWASStudiesQuery.gql";
import { getStudyCategory } from "../../utils/getStudyCategory";
import { formatSamples } from "../../utils/formatSamples";

const columns = [
  {
    id: "studyId",
    label: "Study ID",
    renderCell: ({ studyId }) => (
      <Link to={`./${studyId}`}>{studyId}</Link>
    ),
  },
  {
    id: "author",
    label: "Author",
    renderCell: ({ projectId, publicationFirstAuthor }) => (
      getStudyCategory(projectId) === "FINNGEN"
        ? "FINNGEN_R10"
        : publicationFirstAuthor || naLabel
    ),
    exportValue: ({ projectId, publicationFirstAuthor }) => (
      getStudyCategory(projectId) === "FINNGEN"
        ? "FINNGEN_R10"
        : publicationFirstAuthor 
    ),
  },
  {
    id: "publicationYear",
    label: "Publication date",
    renderCell: ({ projectId, publicationYear }) => (
      getStudyCategory(projectId) === "FINNGEN"
        ? "2023"
        : publicationYear || naLabel
    ),
    exportValue: ({ projectId, publicationYear }) => (
      getStudyCategory(projectId) === "FINNGEN" ? "2023" : publicationYear 
    ),
  },
  {
    id: "publicationJournal",
    label: "Journal",
    renderCell: ({ projectId, publicationJournal }) => (
      getStudyCategory(projectId) === "FINNGEN"
        ? naLabel
        : publicationJournal || naLabel
    ),
    exportValue: ({ projectId, publicationJournal }) => (
      getStudyCategory(projectId) === "FINNGEN" ? naLabel : publicationJournal 
    ),
  },
  {
    id: "nSamples",
    label: "N study",
  },
  {
    id: "initialSampleSize",
    label: "N discovery",
    renderCell: ({ projectId, initialSampleSize, discoverySamples }) => (
      getStudyCategory(projectId) === "GWAS"
        ? initialSampleSize || naLabel
        : discoverySamples?.length
          ? (initialSampleSize
              ? <Tooltip
                  title={
                    <Typography variant="caption">
                      Initial sample size: {initialSampleSize}
                    </Typography>
                  }
                  showHelpIcon
                >
                  {formatSamples(discoverySamples)}
                </Tooltip>
              : formatSamples(discoverySamples)
            )
          : naLabel
    ),
    exportValue: ({ projectId, initialSampleSize, discoverySamples }) => (
      getStudyCategory(projectId) === "GWAS"
        ? initialSampleSize
        : discoverySamples?.length
          ? formatSamples(discoverySamples)
          : null
    )
  },
  {
    id: "replicationSamples",
    label: "N replication",
    renderCell: ({ projectId, replicationSamples }) => (
      getStudyCategory(projectId) === "FINNGEN"
        ? naLabel
        : replicationSamples?.length
          ? formatSamples(replicationSamples)
          : naLabel
    ),
    exportValue:({ projectId, replicationSamples }) => (
      getStudyCategory(projectId) === "FINNGEN"
        ? null
        : replicationSamples
    ),
  },
  {
    id: "nCases",
    label: "N Cases",
  },
  {
    id: "nControls",
    label: "N Controls",
  },
  {
    id: "cohorts",
    label: "Cohorts",
    renderCell: ({ projectId, cohorts, ldPopulationStructure }) => {
      let displayText;
      if (getStudyCategory(projectId) === "FINNGEN") displayText = "FinnGen";
      else if (cohorts?.length) displayText = cohorts.join(", ");
      else return naLabel;
      return ldPopulationStructure?.length
        ? <Tooltip
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
        : displayText;
    },
    exportValue: ({ projectId, cohorts }) => (
      getStudyCategory(projectId) === "FINNGEN"
        ? "FinnGen"
        : cohorts?.length ? cohorts.join(", ") : null
    )
  },
  {
    id: "hasSumstats",
    label: "Has sumstats",
    renderCell: ({ projectId, hasSumstats }) => (
      getStudyCategory(projectId) === "FINNGEN"
        ? "yes"
        : hasSumstats
          ? "yes"
          : "no"
    ),
    exportValue: ({ projectId, hasSumstats }) => (
      getStudyCategory(projectId) === "FINNGEN"
        ? "yes"
        : hasSumstats
          ? "yes"
          : "no"
    ),
  },
  {
    id: "pubmedId",
    label: "PubMed ID",
    renderCell: ({ projectId, pubmedId }) => (
      getStudyCategory(projectId) === "GWAS" && pubmedId 
        ? <Link external to={`https://europepmc.org/article/med/${pubmedId}`}>
            {pubmedId}
          </Link>
        : naLabel
    ),
    exportValue: ({ projectId, pubmedId }) => (
      getStudyCategory(projectId) === "GWAS" && pubmedId 
        ? pubmedId
        : null
    ),
  },
];

type BodyProps = {
  studyId: string,
  diseaseId: string,
  entity: string,
};

export function Body({ studyId, diseaseId, entity }: BodyProps) {

  const variables = {
    diseaseId: diseaseId,
  };

  const request = useQuery(RELATED_GWAS_STUDIES_QUERY, {
    variables,
  });

  return (
    <SectionItem
      definition={definition}
      request={request}
      entity={entity}
      renderDescription={() => <Description studyId={studyId} />}
      renderBody={({ gwasStudy }) => {
        const studies = [];
        const studyIds = new Set([studyId]);
        for (const study of gwasStudy) {
          if (!studyIds.has(study.studyId)) {
            studies.push(study);
            studyIds.add(study.studyId);
          }
        }        
        return (
          <DataTable
            columns={columns}
            rows={studies}
            dataDownloader
            rowsPerPageOptions={defaultRowsPerPageOptions}
            query={RELATED_GWAS_STUDIES_QUERY.loc.source.body}
            variables={variables}
          />
        );
      }}
    />
  );
}

export default Body;