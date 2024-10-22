import { useQuery } from "@apollo/client";
import { Box, Typography } from "@mui/material"; 
import { Link, SectionItem, Tooltip, DataTable, PublicationsDrawer } from "ui";
import Description from "./Description";
import { defaultRowsPerPageOptions, naLabel } from "../../constants";
import { getStudyCategory } from "../../utils/getStudyCategory";
import GWAS_STUDIES_BODY_QUERY from "./GWASStudiesQuery.gql";
import { definition } from ".";
import { epmcUrl } from 'ui/src/utils/urls';

const columns = [
  {
    id: "studyId",
    label: "Study ID",
    renderCell: ({ studyId }) => (
      <Link to={`/study/${studyId}`}>{studyId}</Link>
    ),
  },
  {
    id: 'traitFromSource',
    label: 'Trait from source',
  },
  {
    id: "publicationFirstAuthor",
    label: "Author",
    renderCell: ({ projectId, publicationFirstAuthor }) => (
      getStudyCategory(projectId) === "FINNGEN"
        ? "FinnGen"
        : publicationFirstAuthor || naLabel
    ),
  },
  {
    id: "publicationDate",
    label: "Date",
    renderCell: ({ projectId, publicationDate }) => (
      getStudyCategory(projectId) === "FINNGEN"
        ? "2023"
        : publicationDate
          ? publicationDate.slice(0, 4)
          : naLabel
    ),
    exportValue: ({ projectId, publicationDate }) => (
      getStudyCategory(projectId) === "FINNGEN"
        ? "2023"
        : publicationDate?.slice(0, 4)
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
      getStudyCategory(projectId) === "FINNGEN" ? null : publicationJournal 
    ),
  },
  {
    id: "nSamples",
    label: "Sample size",
    comparator: (a, b) => a?.nSamples - b?.nSamples,
    sortable: true,
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
    id: "pubmedId",
    label: "PubMed ID",
    renderCell: ({ projectId, pubmedId }) => (
      getStudyCategory(projectId) === "GWAS" && pubmedId
        ? <PublicationsDrawer
            entries={[{ name: pubmedId, url: epmcUrl(pubmedId)}]}
          /> 
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
  id: string,
  label: string,
};

function Body({ id: efoId, label: diseaseName }: BodyProps) {
  
  const variables = {
    diseaseIds: [efoId],
  };

  const request = useQuery(GWAS_STUDIES_BODY_QUERY, {
    variables,
  });

  return (
    <SectionItem
      definition={definition}
      entity="gwasStudy"
      pageEntity="disease"
      request={request}
      renderDescription={() => <Description name={diseaseName} />}
      renderBody={({ gwasStudy }) => (
        <DataTable
          columns={columns}
          rows={gwasStudy}
          sortBy="nSamples"
          order="desc"
          dataDownloader
          rowsPerPageOptions={defaultRowsPerPageOptions}
          query={GWAS_STUDIES_BODY_QUERY.loc.source.body}
          variables={variables}
        />
      )}
    />
  );
}

export default Body;
