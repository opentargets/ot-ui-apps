import { useQuery } from "@apollo/client";
import { Box, Typography } from "@mui/material"; 
import { Link, SectionItem, Tooltip, OtTable, PublicationsDrawer } from "ui";

import Description from "./Description";
import {defaultRowsPerPageOptions, naLabel } from "../../constants";
import { getStudyCategory } from "../../utils/getStudyCategory";

import GWAS_STUDIES_BODY_QUERY from "./GWASStudiesQuery.gql";
import { definition } from ".";

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
  studyId: string,
  diseaseIds: string[],
  entity: string,
};

function Body({ id: efoId, entity }) {
  
  const variables = {
    diseaseIds: [efoId],
  };

  const request = useQuery(GWAS_STUDIES_BODY_QUERY, {
    variables,
  });

  return (
    <SectionItem
      definition={definition}
      entity={entity}
      request={request}
      renderDescription={() => <Description name={name} />}
      renderBody={({ gwasStudy }) => (
        <OtTable
          columns={columns}
          rows={rows}
          dataDownloader
          // dataDownloaderFileStem={`${efoId}-phenotypes`}
          rowsPerPageOptions={defaultRowsPerPageOptions}
          query={GWAS_STUDIES_BODY_QUERY.loc.source.body}
          variables={variables}
        />
      )}
    />
  );
}

export default Body;
